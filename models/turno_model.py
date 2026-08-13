from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from models.seccion import Seccion

class Turno(SQLModel, table=True):
    __tablename__ = "turnos"

    id_turno: Optional[int] = Field(default=None, primary_key=True)
    descripcion: str = Field(max_length=50, unique=True)
    is_active: bool = Field(default=True, index=True)

    secciones: List["Seccion"] = Relationship(back_populates="turno")