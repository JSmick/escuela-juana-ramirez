from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from models.horario_model import Horario
    from models.calificacion_model import Calificacion

class Asignatura(SQLModel, table=True):
    __tablename__ = "asignaturas"

    id_asign: Optional[int] = Field(default=None, primary_key=True)
    descripcion: str = Field(max_length=100, unique=True, index=True)
    is_active: bool = Field(default=True, index=True)

    horarios: List["Horario"] = Relationship(back_populates="asignatura")
    calificaciones: List["Calificacion"] = Relationship(back_populates="asignatura")