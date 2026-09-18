from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    client_id: Mapped[int] = mapped_column(
        ForeignKey("clients.id"),
        nullable=False,
    )

    document_id: Mapped[int] = mapped_column(
        ForeignKey("documents.id"),
        nullable=False,
    )

    montant: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    statut: Mapped[str] = mapped_column(
        String(30),
        default="INITIE",
        nullable=False,
    )

    reference_momo: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    date_creation: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    date_paiement: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )