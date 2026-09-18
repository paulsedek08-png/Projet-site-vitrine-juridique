from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import create_access_token, verify_password
from app.models.admin import Admin
from app.schemas.admin import AdminLogin, AdminLoginResponse


router = APIRouter(
    prefix="/admin",
    tags=["Administration"],
)


@router.post(
    "/login",
    response_model=AdminLoginResponse,
)
def admin_login(
    login_data: AdminLogin,
    db: Session = Depends(get_db),
):
    admin = (
        db.query(Admin)
        .filter(Admin.email == login_data.email)
        .first()
    )

    if admin is None:
        raise HTTPException(
            status_code=401,
            detail="Email ou mot de passe incorrect",
        )

    if not admin.actif:
        raise HTTPException(
            status_code=403,
            detail="Compte administrateur désactivé",
        )

    if not verify_password(
        login_data.mot_de_passe,
        admin.mot_de_passe_hash,
    ):
        raise HTTPException(
            status_code=401,
            detail="Email ou mot de passe incorrect",
        )

    access_token = create_access_token(
        {
            "sub": str(admin.id),
            "email": admin.email,
            "role": "admin",
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }