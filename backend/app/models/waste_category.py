from datetime import datetime

from sqlalchemy import DateTime, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class WasteCategory(Base):
    __tablename__ = "waste_categories"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    disposal_instructions: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    center_links = relationship(
        "CenterWasteType",
        back_populates="waste_category",
        cascade="all, delete-orphan",
    )
    collection_centers = relationship(
        "CollectionCenter",
        secondary="center_waste_types",
        back_populates="waste_categories",
        overlaps="waste_type_links,center_links,center,waste_category",
    )
    recycling_activities = relationship(
        "RecyclingActivity", back_populates="waste_category"
    )
