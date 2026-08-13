from sqlmodel import SQLModel, Field, Relationship
from datetime import date
from typing import Optional, TYPE_CHECKING
from core.enums import EstadoAsistencia

if TYPE_CHECKING:
    from models.estudiante_model import Estudiante
    from models.seccion_model import Seccion
    from models.asignatura_model import Asignatura

class Asistencia(SQLModel, table=True):
    __tablename__ = "asistencias"

    id_asistencia: Optional[int] = Field(default=None, primary_key=True)
    fecha: date = Field(default_factory=date.today, index=True)
    estado: EstadoAsistencia = Field(default=EstadoAsistencia.PRESENTE, index=True)
    observacion: Optional[str] = Field(default=None, max_length=255)

    id_estudiante: int = Field(foreign_key="estudiantes.id_studs", index=True)
    id_seccion: int = Field(foreign_key="secciones.id_seccion", index=True)
    id_asignatura: Optional[int] = Field(default=None, foreign_key="asignaturas.id_asign", index=True)

    created_at: date = Field(default_factory=date.today)

    estudiante: Optional["Estudiante"] = Relationship()
    seccion: Optional["Seccion"] = Relationship()
    asignatura: Optional["Asignatura"] = Relationship()