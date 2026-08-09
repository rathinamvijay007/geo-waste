import asyncio
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

from app.database.connection import engine
from app.models import RecentCenterView, RecyclingActivity, Report, SearchHistory, User


async def main():
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        user = (
            await session.execute(select(User).where(User.email == "ecof35_1786282126@example.com"))
        ).scalar_one_or_none()
        if user:
            for model in (RecentCenterView, RecyclingActivity, Report, SearchHistory):
                await session.execute(delete(model).where(model.user_id == user.id))
            await session.delete(user)
            await session.commit()
            print(f"test user {user.id} removed")


asyncio.run(main())
