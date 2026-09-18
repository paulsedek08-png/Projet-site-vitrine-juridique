from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DocumentBase(BaseModel):
    titre: str
    description: str | None = None
    prix: float
    categorie: str
    fichier_url: str


class DocumentCreate(DocumentBase):
    pass


class DocumentUpdate(BaseModel):
    titre: str | None = None
    description: str | None = None
    prix: float | None = None
    categorie: str | None = None
    fichier_url: str | None = None
    actif: bool | None = None


class DocumentResponse(DocumentBase):
    id: int
    date_creation: datetime
    actif: bool

    model_config = ConfigDict(
        from_attributes=True
    )