from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class CollectionCenter(Base):
    __tablename__ = "collection_centers"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    address: Mapped[str] = mapped_column(Text, nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    reviews = relationship("Review", back_populates="center")
    favorites = relationship("Favorite", back_populates="center")
    reports = relationship("Report", back_populates="center")
    waste_type_links = relationship(
        "CenterWasteType",
        back_populates="center",
        cascade="all, delete-orphan",
    )
    waste_categories = relationship(
        "WasteCategory",
        secondary="center_waste_types",
        back_populates="collection_centers",
        overlaps="waste_type_links,center_links,waste_category,center",
    )
    operating_hours = relationship(
        "CenterOperatingHour",
        back_populates="center",
        cascade="all, delete-orphan",
    )
    recent_center_views = relationship(
        "RecentCenterView", back_populates="center"
    )
