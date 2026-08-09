from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database.connection import get_db
from app.models import CollectionCenter, Favorite, User
from app.schemas.collection_center import CollectionCenterResponse
from app.schemas.favorite import FavoriteResponse
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/favorites", tags=["Favorites"])


@router.post(
    "/{center_id}",
    response_model=FavoriteResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_favorite(
    center_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    center = await db.get(CollectionCenter, center_id)

    if not center:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection center not found.",
        )

    existing_favorite = await db.execute(
        select(Favorite).where(
            Favorite.user_id == current_user.id,
            Favorite.center_id == center_id,
        )
    )
    if existing_favorite.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This center is already in your favorites.",
        )

    favorite = Favorite(user_id=current_user.id, center_id=center_id)

    db.add(favorite)
    await db.commit()
    await db.refresh(favorite)

    return favorite


@router.get("", response_model=list[CollectionCenterResponse])
async def list_favorites(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Favorite)
        .where(Favorite.user_id == current_user.id)
        .options(selectinload(Favorite.center))
        .order_by(Favorite.created_at.desc(), Favorite.id.desc())
    )
    favorites = result.scalars().all()

    return [favorite.center for favorite in favorites]


@router.delete("/{center_id}")
async def remove_favorite(
    center_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Favorite).where(
            Favorite.user_id == current_user.id,
            Favorite.center_id == center_id,
        )
    )
    favorite = result.scalar_one_or_none()

    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorite not found.",
        )

    await db.delete(favorite)
    await db.commit()

    return {"message": "Favorite removed."}
