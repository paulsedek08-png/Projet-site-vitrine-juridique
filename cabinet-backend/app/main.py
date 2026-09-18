
from fastapi import FastAPI

from app.core.config import settings
from app.core.database import Base, engine

# ============================================================
# MODELES
# ============================================================

from app.models.admin import Admin
from app.models.client import Client
from app.models.document import Document
from app.models.download import Download
from app.models.transaction import Transaction

# ============================================================
# ROUTES
# ============================================================

from app.routes.documents import router as documents_router
from app.routes.admin import router as admin_router


# ============================================================
# CREATION DES TABLES
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# APPLICATION FASTAPI
# ============================================================

app = FastAPI(
    title=settings.app_name,
    description="API du site vitrine juridique JUJU",
    version=settings.app_version,
)


# ============================================================
# ROUTES DOCUMENTS
# ============================================================

app.include_router(
    documents_router,
)


# ============================================================
# ROUTES ADMINISTRATION
# ============================================================

app.include_router(
    admin_router,
)


# ============================================================
# ROUTE RACINE
# ============================================================

@app.get("/")
def root():
    return {
        "message": "Bienvenue sur l'API du Cabinet Juridique",
        "project": "JUJU",
        "status": "online",
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
    }

