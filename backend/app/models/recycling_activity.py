from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class RecyclingActivity(Base):
    __tablename__ = "recycling_activities"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=False, index=True
    )
    waste_category_id: Mapped[int] = mapped_column(
        ForeignKey("waste_categories.id"), nullable=False
    )
    quantity_kg: Mapped[float] = mapped_column(Float, nullable=False)
    recycled_at: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    user = relationship("User", back_populates="recycling_activities")
    waste_category = relationship(
        "WasteCategory", back_populates="recycling_activities"
    )
