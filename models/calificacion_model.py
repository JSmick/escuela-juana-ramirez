from sqlmodel import SQLModel, Field, Relationship
from datetime import date
from typing import Optional, TYPE_CHECKING
from core.enums import CalificacionLetra

if TYPE_CHECKING:
    from models.estudiante_model import Estudiante
    from models.asignatura_model import Asignatura

class Calificacion(SQLModel, table=True):
    __tablename__ = "calificaciones"

    id_calificacion: Optional[int] = Field(default=None, primary_key=True)
    id_estudiante: int = Field(foreign_key="estudiantes.id_studs", index=True)
    id_asignatura: int = Field(foreign_key="asignaturas.id_asign", index=True)

    lapso_periodo: int = Field(description="1, 2 o 3er Lapso/Momento")

    nota: CalificacionLetra = Field(index=True)

    observacion: Optional[str] = Field(default=None, max_length=255)
    created_at: date = Field(default_factory=date.today)

    estudiante: Optional["Estudiante"] = Relationship(back_populates="calificaciones")
    asignatura: Optional["Asignatura"] = Relationship(back_populates="calificaciones")