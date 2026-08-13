from sqlmodel import SQLModel, Field, Relationship
from datetime import date
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from models.estudiante_model import Estudiante
    from models.seccion_model import Seccion

class Inscripcion(SQLModel, table=True):
    __tablename__ = "inscripciones"

    id_inscripcion: Optional[int] = Field(default=None, primary_key=True)
    id_estudiante: int = Field(foreign_key="estudiantes.id_studs", index=True)
    id_seccion: int = Field(foreign_key="secciones.id_seccion", index=True)

    ano_escolar: str = Field(max_length=10, index=True)
    fecha_inscripcion: date = Field(default_factory=date.today)
    is_active: bool = Field(default=True, index=True)

    estudiante: Optional["Estudiante"] = Relationship()
    seccion: Optional["Seccion"] = Relationship()