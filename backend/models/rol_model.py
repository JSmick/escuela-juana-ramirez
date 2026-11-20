from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from models.usuario_model import Usuario

class Rol(SQLModel, table=True):
    __tablename__ = "roles"

    id_rol: Optional[int] = Field(default=None, primary_key=True)
    nom_rol: str = Field(max_length=25, unique=True, index=True)

    # inverso  rol puede pertenecer a muchos usuarios
    usuarios: List["Usuario"] = Relationship(back_populates="rol")