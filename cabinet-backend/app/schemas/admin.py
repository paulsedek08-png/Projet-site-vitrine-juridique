from pydantic import BaseModel


class AdminLogin(BaseModel):
    email: str
    mot_de_passe: str


class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str