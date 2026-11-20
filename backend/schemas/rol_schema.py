from pydantic import BaseModel
from core.enums import RolEnum

# Esquema para crear un rol (si se requiere)
class RolCreate(BaseModel):
    nom_rol: RolEnum


class RolResponse(BaseModel):
    id_rol: int
    nom_rol: str

    class Config:
        from_attributes = True