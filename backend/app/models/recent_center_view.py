from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class RecentCenterView(Base):
    __tablename__ = "recent_center_views"
    __table_args__ = (
        UniqueConstraint("user_id", "center_id", name="unique_user_center_view"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=False, index=True
    )
    center_id: Mapped[int] = mapped_column(
        ForeignKey("collection_centers.id"), nullable=False, index=True
    )
    viewed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    user = relationship("User", back_populates="recent_center_views")
    center = relationship("CollectionCenter", back_populates="recent_center_views")
