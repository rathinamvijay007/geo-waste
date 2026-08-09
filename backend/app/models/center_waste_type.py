from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class CenterWasteType(Base):
    __tablename__ = "center_waste_types"

    center_id: Mapped[int] = mapped_column(
        ForeignKey("collection_centers.id"),
        primary_key=True,
    )
    waste_category_id: Mapped[int] = mapped_column(
        ForeignKey("waste_categories.id"),
        primary_key=True,
    )

    center = relationship(
        "CollectionCenter",
        back_populates="waste_type_links",
        overlaps="waste_categories,collection_centers",
    )
    waste_category = relationship(
        "WasteCategory",
        back_populates="center_links",
        overlaps="waste_categories,collection_centers",
    )
