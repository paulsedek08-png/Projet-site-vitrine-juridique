
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.document import Document
from app.schemas.document import (
    DocumentCreate,
    DocumentResponse,
    DocumentUpdate,
)


router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


# ============================================================
# GET — Liste des documents
# PUBLIC
# ============================================================

@router.get(
    "",
    response_model=list[DocumentResponse],
)
def get_documents(
    db: Session = Depends(get_db),
):
    documents = (
        db.query(Document)
        .filter(Document.actif == True)
        .all()
    )

    return documents


# ============================================================
# GET — Détail d'un document
# PUBLIC
# ============================================================

@router.get(
    "/{document_id}",
    response_model=DocumentResponse,
)
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
):
    document = (
        db.query(Document)
        .filter(Document.id == document_id)
        .first()
    )

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document introuvable",
        )

    return document


# ============================================================
# POST — Créer un document
# ADMIN UNIQUEMENT
# ============================================================

@router.post(
    "",
    response_model=DocumentResponse,
    status_code=201,
)
def create_document(
    document_data: DocumentCreate,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin),
):
    document = Document(
        titre=document_data.titre,
        description=document_data.description,
        prix=document_data.prix,
        categorie=document_data.categorie,
        fichier_url=document_data.fichier_url,
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return document


# ============================================================
# PUT — Modifier un document
# ADMIN UNIQUEMENT
# ============================================================

@router.put(
    "/{document_id}",
    response_model=DocumentResponse,
)
def update_document(
    document_id: int,
    document_data: DocumentUpdate,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin),
):
    document = (
        db.query(Document)
        .filter(Document.id == document_id)
        .first()
    )

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document introuvable",
        )

    data = document_data.model_dump(
        exclude_unset=True
    )

    for field, value in data.items():
        setattr(document, field, value)

    db.commit()
    db.refresh(document)

    return document


# ============================================================
# DELETE — Désactiver un document
# ADMIN UNIQUEMENT
# ============================================================

@router.delete(
    "/{document_id}",
)
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin),
):
    document = (
        db.query(Document)
        .filter(Document.id == document_id)
        .first()
    )

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document introuvable",
        )

    document.actif = False

    db.commit()

    return {
        "message": "Document désactivé avec succès",
        "document_id": document_id,
    }

