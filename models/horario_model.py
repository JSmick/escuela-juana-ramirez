from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING, List
from datetime import time
from core.enums import DiaSemana

if TYPE_CHECKING:
    from models.docente_model import Docente
    from models.aula_model import Aula
    from models.seccion_model import Seccion
    from models.asignatura_model import Asignatura
    from models.asistenciaDocente_model import AsistenciaDocente

class Horario(SQLModel, table=True):
    __tablename__ = "horarios"

    id_horario: Optional[int] = Field(default=None, primary_key=True)
    dia: DiaSemana = Field(index=True)
    hora_inicio: time
    hora_fin: time

    id_docent: int = Field(foreign_key="docentes.id_docen", index=True)
    id_aula: int = Field(foreign_key="aulas.id_aula", index=True)
    id_seccion: int = Field(foreign_key="secciones.id_seccion", index=True)
    id_asig: int = Field(foreign_key="asignaturas.id_asign", index=True)
    is_active: bool = Field(default=True, index=True)

    docente: Optional["Docente"] = Relationship(back_populates="horarios")
    aula: Optional["Aula"] = Relationship(back_populates="horarios")
    seccion: Optional["Seccion"] = Relationship(back_populates="horarios")
    asignatura: Optional["Asignatura"] = Relationship(back_populates="horarios")
    asistencias_docente: List["AsistenciaDocente"] = Relationship(back_populates="horario")