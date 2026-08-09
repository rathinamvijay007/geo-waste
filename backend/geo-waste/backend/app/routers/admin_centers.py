from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.models import (
    CenterOperatingHour,
    CenterWasteType,
    CollectionCenter,
    Favorite,
    Report,
    Review,
    User,
)
from app.schemas.admin_center import AdminCenterCreateRequest, AdminCenterUpdateRequest
from app.schemas.collection_center import CollectionCenterResponse
from app.utils.dependencies import get_current_admin

router = APIRouter(prefix="/api/admin/centers", tags=["Admin - Centers"])


@router.post(
    "",
    response_model=CollectionCenterResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_center(
    request: AdminCenterCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    center = CollectionCenter(**request.model_dump())

    db.add(center)
    await db.commit()
    await db.refresh(center)

    return center


@router.put("/{center_id}", response_model=CollectionCenterResponse)
async def update_center(
    center_id: int,
    request: AdminCenterUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    center = await db.get(CollectionCenter, center_id)

    if not center:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection center not found.",
        )

    update_data = request.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(center, field, value)

    await db.commit()
    await db.refresh(center)

    return center


@router.delete("/{center_id}")
async def delete_center(
    center_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    center = await db.get(CollectionCenter, center_id)

    if not center:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection center not found.",
        )

    await db.execute(delete(Favorite).where(Favorite.center_id == center_id))
    await db.execute(delete(Review).where(Review.center_id == center_id))
    await db.execute(delete(Report).where(Report.center_id == center_id))
    await db.execute(
        delete(CenterWasteType).where(CenterWasteType.center_id == center_id)
    )
    await db.execute(
        delete(CenterOperatingHour).where(CenterOperatingHour.center_id == center_id)
    )
    await db.execute(delete(CollectionCenter).where(CollectionCenter.id == center_id))

    await db.commit()

    return {"message": "Collection center deleted."}
