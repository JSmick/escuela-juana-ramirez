from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from models.rol_model import Rol

class Usuario(SQLModel, table=True):
    __tablename__ = "usuario"

    id_user: Optional[int] = Field(default=None, primary_key=True)
    correo_user: str = Field(max_length=100, unique=True, index=True)
    pass_user: str = Field(max_length=255)  
    id_rol: int = Field(foreign_key="roles.id_rol", index=True)

    rol: Optional["Rol"] = Relationship(back_populates="usuarios")