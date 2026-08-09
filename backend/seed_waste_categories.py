import asyncio

from sqlalchemy import select

from app.database.connection import AsyncSessionLocal
from app.models import WasteCategory


INITIAL_WASTE_CATEGORIES = [
    {
        "name": "Plastic",
        "description": "Plastic bottles, containers, packaging and other recyclable plastic materials.",
        "disposal_instructions": "Clean and dry the plastic before placing it in a suitable recycling collection center.",
    },
    {
        "name": "E-Waste",
        "description": "Electronic items such as computers, phones, chargers and other electronic equipment.",
        "disposal_instructions": "Do not mix electronic waste with regular garbage. Take it to an authorized e-waste collection center.",
    },
    {
        "name": "Batteries",
        "description": "Used household and rechargeable batteries.",
        "disposal_instructions": "Keep batteries separate from regular waste and take them to an appropriate collection center.",
    },
    {
        "name": "Paper",
        "description": "Newspapers, books, cardboard and other recyclable paper materials.",
        "disposal_instructions": "Keep paper dry and remove non-paper materials before recycling.",
    },
    {
        "name": "Glass",
        "description": "Glass bottles, jars and other recyclable glass containers.",
        "disposal_instructions": "Handle broken glass carefully and separate glass from other waste before recycling.",
    },
    {
        "name": "Metal",
        "description": "Aluminium cans, metal containers and other recyclable metal materials.",
        "disposal_instructions": "Clean metal items and separate them from other waste before recycling.",
    },
]


async def seed_waste_categories():
    added_count = 0

    async with AsyncSessionLocal() as session:
        for category_data in INITIAL_WASTE_CATEGORIES:
            result = await session.execute(
                select(WasteCategory).where(
                    WasteCategory.name == category_data["name"]
                )
            )
            existing_category = result.scalar_one_or_none()

            if existing_category:
                continue

            session.add(WasteCategory(**category_data))
            added_count += 1

        await session.commit()

    print(f"Waste category seed complete. Added {added_count} categories.")


if __name__ == "__main__":
    asyncio.run(seed_waste_categories())
