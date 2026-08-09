import math
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database.connection import get_db
from app.models import (
    CenterOperatingHour,
    CenterWasteType,
    CollectionCenter,
    Favorite,
    RecentCenterView,
    Report,
    Review,
    SearchHistory,
    User,
    WasteCategory,
)
from app.schemas.center_operating_hour import (
    CenterAvailabilityResponse,
    CenterOperatingHourResponse,
)
from app.schemas.collection_center import (
    CollectionCenterResponse,
    NearbyCollectionCenterResponse,
    PopularCenterResponse,
)
from app.schemas.report import ReportCreateRequest, ReportResponse
from app.schemas.review import ReviewCreateRequest, ReviewResponse
from app.schemas.waste_category import WasteCategoryResponse
from app.utils.dependencies import get_current_user, get_optional_user

router = APIRouter(prefix="/api/centers", tags=["Collection Centers"])


def haversine(latitude1, longitude1, latitude2, longitude2):
    earth_radius_km = 6371.0

    lat1 = math.radians(latitude1)
    lon1 = math.radians(longitude1)
    lat2 = math.radians(latitude2)
    lon2 = math.radians(longitude2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return earth_radius_km * c


@router.get("", response_model=list[CollectionCenterResponse])
async def list_collection_centers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CollectionCenter).order_by(CollectionCenter.id))
    return result.scalars().all()


@router.get("/nearby", response_model=list[NearbyCollectionCenterResponse])
async def get_nearby_collection_centers(
    latitude: float = Query(..., description="Latitude of the user's location"),
    longitude: float = Query(..., description="Longitude of the user's location"),
    radius: float | None = Query(
        None, gt=0, description="Search radius in kilometers (defaults to 10)"
    ),
    waste_type: str | None = Query(
        None, description="Optional waste category name to filter by"
    ),
    sort: str | None = Query(
        None, pattern="^(rating|distance)$", description="Optional sort: 'rating' or 'distance'"
    ),
    db: AsyncSession = Depends(get_db),
):
    center_ids = None

    if waste_type:
        result = await db.execute(
            select(WasteCategory).where(WasteCategory.name == waste_type)
        )
        waste_category = result.scalar_one_or_none()

        if not waste_category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Waste category '{waste_type}' not found.",
            )

        links = await db.execute(
            select(CenterWasteType.center_id).where(
                CenterWasteType.waste_category_id == waste_category.id
            )
        )
        center_ids = set(links.scalars().all())

    rating_map = {}
    if sort == "rating":
        review_stats = await db.execute(
            select(
                Review.center_id.label("center_id"),
                func.coalesce(func.avg(Review.rating), 0).label("average_rating"),
                func.count(Review.id).label("review_count"),
            ).group_by(Review.center_id)
        )
        for center_id, average_rating, review_count in review_stats.all():
            rating_map[center_id] = (float(average_rating), review_count)

    result = await db.execute(select(CollectionCenter))
    centers = result.scalars().all()

    effective_radius = radius if radius is not None else 10.0

    nearby = []
    for center in centers:
        if center_ids is not None and center.id not in center_ids:
            continue

        distance_km = haversine(
            latitude, longitude, center.latitude, center.longitude
        )
        if distance_km <= effective_radius:
            entry = {
                "id": center.id,
                "name": center.name,
                "description": center.description,
                "address": center.address,
                "latitude": center.latitude,
                "longitude": center.longitude,
                "phone": center.phone,
                "verified": center.verified,
                "distance_km": round(distance_km, 2),
            }

            if sort == "rating":
                average_rating, review_count = rating_map.get(
                    center.id, (0.0, 0)
                )
                entry["average_rating"] = round(average_rating, 2)
                entry["review_count"] = review_count

            nearby.append(entry)

    if sort == "rating":
        nearby.sort(
            key=lambda center: (
                -center["average_rating"],
                -center["review_count"],
                center["distance_km"],
            )
        )
    else:
        nearby.sort(key=lambda center: center["distance_km"])

    return nearby


@router.get("/verified", response_model=list[CollectionCenterResponse])
async def list_verified_collection_centers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(CollectionCenter)
        .where(CollectionCenter.verified.is_(True))
        .order_by(CollectionCenter.id)
    )
    return result.scalars().all()


@router.get("/search", response_model=list[CollectionCenterResponse])
async def search_collection_centers(
    q: str = Query("", description="Search query for name, address, or description"),
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    if not q.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Search query must not be empty.",
        )

    pattern = f"%{q.strip()}%"

    result = await db.execute(
        select(CollectionCenter)
        .where(
            or_(
                CollectionCenter.name.ilike(pattern),
                CollectionCenter.address.ilike(pattern),
                CollectionCenter.description.ilike(pattern),
            )
        )
        .order_by(CollectionCenter.id)
    )

    if current_user is not None:
        db.add(
            SearchHistory(
                user_id=current_user.id,
                query=q.strip(),
                search_type="center",
            )
        )
        await db.commit()

    return result.scalars().all()


@router.get("/popular", response_model=list[PopularCenterResponse])
async def list_popular_centers(db: AsyncSession = Depends(get_db)):
    review_stats = (
        select(
            Review.center_id.label("center_id"),
            func.coalesce(func.avg(Review.rating), 0).label("average_rating"),
            func.count(Review.id).label("review_count"),
        )
        .group_by(Review.center_id)
        .subquery()
    )

    favorite_counts = (
        select(
            Favorite.center_id.label("center_id"),
            func.count(Favorite.id).label("favorite_count"),
        )
        .group_by(Favorite.center_id)
        .subquery()
    )

    result = await db.execute(
        select(
            CollectionCenter,
            func.coalesce(review_stats.c.average_rating, 0).label("average_rating"),
            func.coalesce(review_stats.c.review_count, 0).label("review_count"),
            func.coalesce(favorite_counts.c.favorite_count, 0).label("favorite_count"),
        )
        .outerjoin(review_stats, review_stats.c.center_id == CollectionCenter.id)
        .outerjoin(favorite_counts, favorite_counts.c.center_id == CollectionCenter.id)
        .order_by(
            func.coalesce(review_stats.c.average_rating, 0).desc(),
            func.coalesce(review_stats.c.review_count, 0).desc(),
            func.coalesce(favorite_counts.c.favorite_count, 0).desc(),
            CollectionCenter.id,
        )
    )

    centers = []
    for center, average_rating, review_count, favorite_count in result.all():
        centers.append(
            {
                "id": center.id,
                "name": center.name,
                "description": center.description,
                "address": center.address,
                "latitude": center.latitude,
                "longitude": center.longitude,
                "phone": center.phone,
                "verified": center.verified,
                "average_rating": round(float(average_rating), 2),
                "review_count": review_count,
                "favorite_count": favorite_count,
            }
        )

    return centers


@router.get("/{center_id}/availability", response_model=CenterAvailabilityResponse)
async def get_center_availability(
    center_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CollectionCenter)
        .where(CollectionCenter.id == center_id)
        .options(selectinload(CollectionCenter.operating_hours))
    )
    center = result.scalar_one_or_none()

    if not center:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection center not found.",
        )

    now = datetime.now()
    day_of_week = now.weekday()
    current_time = now.time()

    todays_hours = [
        hour
        for hour in center.operating_hours
        if hour.day_of_week == day_of_week
    ]

    if not todays_hours:
        return CenterAvailabilityResponse(
            center_id=center_id,
            is_open=False,
            day_of_week=day_of_week,
            open_time=None,
            close_time=None,
            message="No operating hours configured for today.",
        )

    opening = todays_hours[0]
    is_open = opening.open_time <= current_time < opening.close_time

    return CenterAvailabilityResponse(
        center_id=center_id,
        is_open=is_open,
        day_of_week=day_of_week,
        open_time=opening.open_time,
        close_time=opening.close_time,
        message="Open" if is_open else "Closed",
    )


@router.get("/{center_id}", response_model=CollectionCenterResponse)
async def get_collection_center(
    center_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    result = await db.execute(
        select(CollectionCenter).where(CollectionCenter.id == center_id)
    )
    center = result.scalar_one_or_none()

    if not center:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection center not found.",
        )

    if current_user is not None:
        existing_view = await db.execute(
            select(RecentCenterView).where(
                RecentCenterView.user_id == current_user.id,
                RecentCenterView.center_id == center_id,
            )
        )
        view = existing_view.scalar_one_or_none()

        if view:
            view.viewed_at = func.now()
        else:
            db.add(
                RecentCenterView(
                    user_id=current_user.id,
                    center_id=center_id,
                )
            )
        await db.commit()

    return center


@router.get("/{center_id}/hours", response_model=list[CenterOperatingHourResponse])
async def get_center_operating_hours(
    center_id: int,
    db: AsyncSession = Depends(get_db),
):
    center = await db.get(CollectionCenter, center_id)

    if not center:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection center not found.",
        )

    result = await db.execute(
        select(CenterOperatingHour)
        .where(CenterOperatingHour.center_id == center_id)
        .order_by(CenterOperatingHour.day_of_week)
    )
    return result.scalars().all()


@router.get("/{center_id}/waste-types", response_model=list[WasteCategoryResponse])
async def get_center_waste_types(
    center_id: int,
    db: AsyncSession = Depends(get_db),
):
    center = await db.get(CollectionCenter, center_id)

    if not center:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection center not found.",
        )

    result = await db.execute(
        select(WasteCategory)
        .join(CenterWasteType, CenterWasteType.waste_category_id == WasteCategory.id)
        .where(CenterWasteType.center_id == center_id)
        .order_by(WasteCategory.id)
    )
    return result.scalars().all()


@router.post(
    "/{center_id}/reviews",
    response_model=ReviewResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_center_review(
    center_id: int,
    request: ReviewCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    center = await db.get(CollectionCenter, center_id)

    if not center:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection center not found.",
        )

    existing_review = await db.execute(
        select(Review).where(
            Review.user_id == current_user.id,
            Review.center_id == center_id,
        )
    )
    if existing_review.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reviewed this collection center.",
        )

    review = Review(
        user_id=current_user.id,
        center_id=center_id,
        rating=request.rating,
        comment=request.comment,
    )

    db.add(review)
    await db.commit()
    await db.refresh(review)

    return review


@router.get("/{center_id}/reviews", response_model=list[ReviewResponse])
async def list_center_reviews(
    center_id: int,
    db: AsyncSession = Depends(get_db),
):
    center = await db.get(CollectionCenter, center_id)

    if not center:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection center not found.",
        )

    result = await db.execute(
        select(Review)
        .where(Review.center_id == center_id)
        .order_by(Review.created_at.desc(), Review.id.desc())
    )
    return result.scalars().all()


@router.post(
    "/{center_id}/report",
    response_model=ReportResponse,
    status_code=status.HTTP_201_CREATED,
)
async def report_center(
    center_id: int,
    request: ReportCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    center = await db.get(CollectionCenter, center_id)

    if not center:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection center not found.",
        )

    report = Report(
        user_id=current_user.id,
        center_id=center_id,
        reason=request.reason,
        description=request.description,
        status="pending",
    )

    db.add(report)
    await db.commit()
    await db.refresh(report)

    return report
