import asyncio

from sqlalchemy import text

from app.database.connection import engine


async def test_connection():
    try:
        async with engine.connect() as connection:
            await connection.execute(text("SELECT 1"))
        print("Database connection successful")
    except Exception as error:
        print("Database connection failed")
        print(f"Error: {error}")


if __name__ == "__main__":
    asyncio.run(test_connection())
