from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.models import WasteCategory
from app.schemas.waste_category import WasteCategoryResponse

router = APIRouter(prefix="/api/waste-categories", tags=["Waste Categories"])


@router.get("", response_model=list[WasteCategoryResponse])
async def list_waste_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(WasteCategory).order_by(WasteCategory.id))
    return result.scalars().all()


@router.get("/{category_id}", response_model=WasteCategoryResponse)
async def get_waste_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(WasteCategory).where(WasteCategory.id == category_id)
    )
    waste_category = result.scalar_one_or_none()

    if not waste_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Waste category not found.",
        )

    return waste_category
