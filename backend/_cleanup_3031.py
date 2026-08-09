import asyncio
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

from app.database.connection import engine
from app.models import Report, SearchHistory, User


async def main():
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        report = (
            await session.execute(select(Report).where(Report.id == 4))
        ).scalar_one_or_none()
        print(f"DB report id=4 -> user_id={report.user_id} center_id={report.center_id} reason={report.reason} status={report.status}")

        for email in ["t3031_1786281171@example.com", "t3031b_1786281171@example.com"]:
            user = (
                await session.execute(select(User).where(User.email == email))
            ).scalar_one_or_none()
            if user:
                await session.execute(
                    delete(Report).where(Report.user_id == user.id)
                )
                await session.execute(
                    delete(SearchHistory).where(SearchHistory.user_id == user.id)
                )
                await session.delete(user)

        await session.commit()
        print("test users 10/11 + their reports/search history removed")

        reports_left = (await session.execute(select(Report))).scalars().all()
        history_left = (await session.execute(select(SearchHistory))).scalars().all()
        print(f"remaining reports: {len(reports_left)}")
        print(f"remaining search_history: {len(history_left)}")


asyncio.run(main())
