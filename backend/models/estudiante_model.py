from datetime import date
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from core.enums import Genero

if TYPE_CHECKING:
    from models.representante_model import Representante
    from models.inscripcion_model import Inscripcion
    from models.calificacion_model import Calificacion
    from models.asistencia_model import Asistencia

class Estudiante(SQLModel, table=True):
    __tablename__ = "estudiantes"

    id_studs: Optional[int] = Field(default=None, primary_key=True)
    nom: str = Field(max_length=50)
    apell: str = Field(max_length=50)
    fecha_nac: date
    id_repre: Optional[int] = Field(default=None, foreign_key="representantes.id_represen", index=True)

    genero: Genero = Field(index=True)
    representante: Optional["Representante"] = Relationship(back_populates="estudiantes")
    inscripciones: List["Inscripcion"] = Relationship(back_populates="estudiante")
    calificaciones: List["Calificacion"] = Relationship(back_populates="estudiante")
    asistencias: List["Asistencia"] = Relationship(back_populates="estudiante")

    is_active: bool = Field(default=True, index=True)
    created_at: date = Field(default_factory=date.today)
    updated_at: Optional[date] = Field(default=None)

    genero: str = Field(default=None, max_length=15)
    cedula_esco_cedula: str = Field(default=None, max_length=20)
    observaciones_med: str = Field(default=None, max_length=50)