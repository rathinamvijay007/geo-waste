import asyncio
from datetime import time

from sqlalchemy import select

from app.database.connection import AsyncSessionLocal
from app.models import CenterOperatingHour, CollectionCenter


INITIAL_COLLECTION_CENTERS = [
    {
        "name": "EcoRecycle Center",
        "description": "General recyclable waste collection center.",
        "address": "Anna Nagar, Chennai, Tamil Nadu",
        "latitude": 13.0850,
        "longitude": 80.2101,
        "phone": "9876543210",
        "verified": True,
    },
    {
        "name": "Green Earth Recycling",
        "description": "Collection center for electronic and recyclable waste.",
        "address": "T Nagar, Chennai, Tamil Nadu",
        "latitude": 13.0418,
        "longitude": 80.2341,
        "phone": "9876543211",
        "verified": True,
    },
    {
        "name": "Clean City Waste Hub",
        "description": "Recycling center accepting household recyclable materials.",
        "address": "Adyar, Chennai, Tamil Nadu",
        "latitude": 13.0067,
        "longitude": 80.2572,
        "phone": "9876543212",
        "verified": True,
    },
    {
        "name": "Recycle Point",
        "description": "Local waste collection and recycling facility.",
        "address": "Velachery, Chennai, Tamil Nadu",
        "latitude": 12.9750,
        "longitude": 80.2210,
        "phone": "9876543213",
        "verified": False,
    },
    {
        "name": "EcoCare Collection Center",
        "description": "Waste collection center for recyclable and electronic materials.",
        "address": "Tambaram, Chennai, Tamil Nadu",
        "latitude": 12.9249,
        "longitude": 80.1000,
        "phone": "9876543214",
        "verified": True,
    },
]

INITIAL_OPERATING_HOURS = {
    "EcoRecycle Center": [
        (0, "09:00", "18:00"),
        (1, "09:00", "18:00"),
        (2, "09:00", "18:00"),
        (3, "09:00", "18:00"),
        (4, "09:00", "18:00"),
        (5, "09:00", "14:00"),
        (6, "10:00", "14:00"),
    ],
    "Green Earth Recycling": [
        (0, "08:00", "19:00"),
        (1, "08:00", "19:00"),
        (2, "08:00", "19:00"),
        (3, "08:00", "19:00"),
        (4, "08:00", "19:00"),
        (5, "08:00", "19:00"),
        (6, "08:00", "19:00"),
    ],
    "Clean City Waste Hub": [
        (0, "09:00", "17:00"),
        (1, "09:00", "17:00"),
        (2, "09:00", "17:00"),
        (3, "09:00", "17:00"),
        (4, "09:00", "17:00"),
        (5, "09:00", "17:00"),
        (6, "09:00", "17:00"),
    ],
    "EcoCare Collection Center": [
        (0, "10:00", "20:00"),
        (1, "10:00", "20:00"),
        (2, "10:00", "20:00"),
        (3, "10:00", "20:00"),
        (4, "10:00", "20:00"),
        (5, "10:00", "20:00"),
        (6, "10:00", "20:00"),
    ],
}


async def seed_collection_centers():
    added_count = 0

    async with AsyncSessionLocal() as session:
        for center_data in INITIAL_COLLECTION_CENTERS:
            result = await session.execute(
                select(CollectionCenter).where(
                    CollectionCenter.name == center_data["name"]
                )
            )
            existing_center = result.scalar_one_or_none()

            if existing_center:
                continue

            session.add(CollectionCenter(**center_data))
            added_count += 1

        centers_result = await session.execute(select(CollectionCenter))
        centers = {center.name: center for center in centers_result.scalars().all()}

        hours_added = 0
        for name, hours_list in INITIAL_OPERATING_HOURS.items():
            center = centers.get(name)
            if not center:
                continue

            existing_days = await session.execute(
                select(CenterOperatingHour.day_of_week).where(
                    CenterOperatingHour.center_id == center.id
                )
            )
            existing_days_set = set(existing_days.scalars().all())

            for day, open_str, close_str in hours_list:
                if day in existing_days_set:
                    continue

                session.add(
                    CenterOperatingHour(
                        center_id=center.id,
                        day_of_week=day,
                        open_time=time.fromisoformat(open_str),
                        close_time=time.fromisoformat(close_str),
                    )
                )
                hours_added += 1

        await session.commit()

    print(f"Added {added_count} collection centers.")
    print(f"Added {hours_added} operating hours.")


if __name__ == "__main__":
    asyncio.run(seed_collection_centers())
