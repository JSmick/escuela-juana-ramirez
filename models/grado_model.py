from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from core.enums import NivelGrado

if TYPE_CHECKING:
    from models.seccion_model import Seccion

class Grado(SQLModel, table=True):
    __tablename__ = "grados"

    id_grad: Optional[int] = Field(default=None, primary_key=True)
    descripcion: NivelGrado = Field(unique=True, index=True)
    is_active: bool = Field(default=True, index=True)

    secciones: List["Seccion"] = Relationship(back_populates="grado")