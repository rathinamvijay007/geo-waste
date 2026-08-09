import asyncio
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

from app.database.connection import engine
from app.models import RecentCenterView, SearchHistory, User


async def main():
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        user = (
            await session.execute(
                select(User).where(User.email == "rec_test_1786280797@example.com")
            )
        ).scalar_one_or_none()
        if user:
            await session.execute(
                delete(RecentCenterView).where(RecentCenterView.user_id == user.id)
            )
            await session.execute(
                delete(SearchHistory).where(SearchHistory.user_id == user.id)
            )
            await session.delete(user)
            await session.commit()

        views = (await session.execute(select(RecentCenterView))).scalars().all()
        history = (await session.execute(select(SearchHistory))).scalars().all()
        print(f"remaining recent_center_views: {len(views)}")
        print(f"remaining search_history: {len(history)}")


asyncio.run(main())
