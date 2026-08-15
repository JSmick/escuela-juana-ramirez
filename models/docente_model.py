from sqlmodel import SQLModel, Relationship, Field
from datetime import date
from typing import Optional, TYPE_CHECKING, List
from core.enums import EstadoLaboral

if TYPE_CHECKING:
    from models.seccion_model import Seccion
    from models.horario_model import Horario
    from models.asistenciaDocente_model import AsistenciaDocente

class Docente(SQLModel, table=True):
    __tablename__ = "docentes"

    id_docen: Optional[int] = Field(default=None, primary_key=True)
    nom: str = Field(max_length=50)
    apell: str = Field(max_length=50)
    cedula: str = Field(unique=True, index=True, max_length=20)
    telef: Optional[str] = Field(default=None, max_length=20)
    email: Optional[str] = Field(default=None, unique=True, index=True, max_length=100)
    fec_ingre: date = Field(default_factory=date.today)
    estado_laboral: EstadoLaboral = Field(default=EstadoLaboral.ACTIVO)
    is_active: bool = Field(default=True, index=True)

    secciones: List["Seccion"] = Relationship(back_populates="docente")
    horarios: List["Horario"] = Relationship(back_populates="docente")
    asistencias_docente: List["AsistenciaDocente"] = Relationship(back_populates="docente")

    created_at: date = Field(default_factory=date.today)
    updated_at: Optional[date] = Field(default=None)