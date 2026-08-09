from datetime import time

from sqlalchemy import ForeignKey, SmallInteger, Time, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class CenterOperatingHour(Base):
    __tablename__ = "center_operating_hours"
    __table_args__ = (
        UniqueConstraint(
            "center_id", "day_of_week", name="unique_center_day_operating_hour"
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    center_id: Mapped[int] = mapped_column(
        ForeignKey("collection_centers.id", ondelete="CASCADE"), nullable=False
    )
    day_of_week: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    open_time: Mapped[time] = mapped_column(Time, nullable=False)
    close_time: Mapped[time] = mapped_column(Time, nullable=False)

    center = relationship("CollectionCenter", back_populates="operating_hours")
