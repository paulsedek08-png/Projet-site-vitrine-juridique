from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.admin import Admin


EMAIL = "admin@juju.com"
NOM = "Administrateur JUJU"
MOT_DE_PASSE = "AdminJuju123!"


def create_admin():
    db = SessionLocal()

    try:
        existing_admin = (
            db.query(Admin)
            .filter(Admin.email == EMAIL)
            .first()
        )

        if existing_admin:
            print("ADMIN EXISTE DEJA")
            return

        admin = Admin(
            nom=NOM,
            email=EMAIL,
            mot_de_passe_hash=hash_password(MOT_DE_PASSE),
            actif=True,
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        print("ADMIN CREE AVEC SUCCES")
        print(f"ID : {admin.id}")
        print(f"EMAIL : {admin.email}")

    finally:
        db.close()


if __name__ == "__main__":
    create_admin()