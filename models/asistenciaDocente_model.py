from datetime import date, time
from typing import TYPE_CHECKING, Optional
from sqlmodel import Field, Relationship, SQLModel
from core.enums import EstadoAsistencia

if TYPE_CHECKING:
    from models.docente_model import Docente
    from models.horario_model import Horario

class AsistenciaDocente(SQLModel, table=True):
    __tablename__ = "asistencias_docentes"

    id_asistencia_docente: Optional[int] = Field(default=None, primary_key=True)
    id_docen: int = Field(foreign_key="docentes.id_docen", index=True)
    id_horario: Optional[int] = Field(default=None, foreign_key="horarios.id_horario", index=True)

    fecha: date = Field(default_factory=date.today, index=True)
    hora_entrada: Optional[time] = Field(default=None, description="Hora exacta en la que marcó entrada")
    hora_salida: Optional[time] = Field(default=None, description="Hora exacta en la que marcó salida")

    estado: EstadoAsistencia = Field(default=EstadoAsistencia.PRESENTE, index=True)
    observacion: Optional[str] = Field(default=None, max_length=255, description="Motivo de permiso o justificación")

    created_at: date = Field(default_factory=date.today)

    docente: Optional["Docente"] = Relationship(back_populates="asistencias_docente")
    horario: Optional["Horario"] = Relationship(back_populates="asistencias_docente")