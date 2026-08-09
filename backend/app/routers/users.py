from fastapi import APIRouter, Depends
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database.connection import get_db
from app.models import CollectionCenter, RecentCenterView, RecyclingActivity, SearchHistory, User
from app.schemas.auth import UserResponse
from app.schemas.eco_stats import EcoCategoryStats, EcoStatsResponse
from app.schemas.user import ProfileUpdateRequest, RecentCenterResponse, SearchHistoryResponse
from app.utils.dependencies import get_current_user
from app.utils.eco_impact import calculate_impact

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    request: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    update_data = request.model_dump(exclude_unset=True)

    if "name" in update_data:
        current_user.name = update_data["name"]

    if "phone" in update_data:
        current_user.phone = update_data["phone"]

    await db.commit()
    await db.refresh(current_user)

    return current_user


@router.get("/me/eco-stats", response_model=EcoStatsResponse)
async def get_current_user_eco_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(RecyclingActivity)
        .where(RecyclingActivity.user_id == current_user.id)
        .options(selectinload(RecyclingActivity.waste_category))
        .order_by(RecyclingActivity.created_at.asc(), RecyclingActivity.id.asc())
    )
    activities = result.scalars().all()

    total_recycled_kg = 0.0
    total_co2_saved_kg = 0.0
    total_energy_saved_kwh = 0.0
    by_category = []

    for activity in activities:
        impact = calculate_impact(
            activity.quantity_kg,
            activity.waste_category.name,
        )

        total_recycled_kg += impact["quantity_kg"]
        total_co2_saved_kg += impact["co2_saved_kg"]
        total_energy_saved_kwh += impact["energy_saved_kwh"]

        by_category.append(
            EcoCategoryStats(
                waste_type=impact["waste_type"],
                quantity_kg=impact["quantity_kg"],
                co2_saved_kg=impact["co2_saved_kg"],
                energy_saved_kwh=impact["energy_saved_kwh"],
            )
        )

    return EcoStatsResponse(
        total_recycled_kg=total_recycled_kg,
        total_co2_saved_kg=total_co2_saved_kg,
        total_energy_saved_kwh=total_energy_saved_kwh,
        activity_count=len(activities),
        by_category=by_category,
    )


@router.get("/me/recent-centers", response_model=list[RecentCenterResponse])
async def get_recent_centers(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CollectionCenter, RecentCenterView.viewed_at)
        .join(RecentCenterView, RecentCenterView.center_id == CollectionCenter.id)
        .where(RecentCenterView.user_id == current_user.id)
        .order_by(RecentCenterView.viewed_at.desc(), RecentCenterView.id.desc())
    )

    seen = set()
    recent_centers = []

    for center, viewed_at in result.all():
        if center.id in seen:
            continue
        seen.add(center.id)

        recent_centers.append(
            RecentCenterResponse(
                id=center.id,
                name=center.name,
                address=center.address,
                latitude=center.latitude,
                longitude=center.longitude,
                verified=center.verified,
                viewed_at=viewed_at,
            )
        )

    return recent_centers


@router.get("/me/search-history", response_model=list[SearchHistoryResponse])
async def get_search_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SearchHistory)
        .where(SearchHistory.user_id == current_user.id)
        .order_by(SearchHistory.created_at.desc(), SearchHistory.id.desc())
    )

    return result.scalars().all()


@router.delete("/me/search-history")
async def clear_search_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        delete(SearchHistory).where(SearchHistory.user_id == current_user.id)
    )
    await db.commit()

    return {
        "message": "Search history cleared",
        "deleted_count": result.rowcount,
    }
