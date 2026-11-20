from pydantic import BaseModel, EmailStr,Field
from typing import Optional,  Literal
from schemas.rol_schema import RolResponse

class RepresentanteCreate(BaseModel):
    correo_user: EmailStr
    pass_user: str  
    id_rol: Literal[3] = 3

class UsuarioCreate(BaseModel):
    correo_user: EmailStr
    pass_user: str  
    id_rol: int

# l Login
class UsuarioLogin(BaseModel):
    correo_user: EmailStr
    pass_user: str

#  API responde 
class UsuarioResponse(BaseModel):
    id_user: int
    correo_user: str
    id_rol: int
    rol: Optional[RolResponse] = None

    class Config:
        from_attributes = True

#esquema para la respuesta del Token de acceso (JWT)
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"