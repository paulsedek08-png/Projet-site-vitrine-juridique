from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    titre: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    prix: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    categorie: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    fichier_url: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    date_creation: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    actif: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )