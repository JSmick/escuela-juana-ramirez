from sqlmodel import SQLModel, Field, Relationship
from datetime import date
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from models.docente import Docente
    from models.turno import Turno
    from models.grado import Grado
    from models.horario import Horario
    from models.inscripcion import Inscripcion
    from models.ano_escolar import AnoEscolar

class Seccion(SQLModel, table=True):
    __tablename__ = "secciones"

    id_seccion: Optional[int] = Field(default=None, primary_key=True)
    descripcion: str = Field(max_length=10)

    id_turno: int = Field(foreign_key="turnos.id_turno", index=True)
    id_grado: int = Field(foreign_key="grados.id_grad", index=True)
    id_docent: Optional[int] = Field(default=None, foreign_key="docentes.id_docen", index=True)
    id_ano_escolar: int = Field(foreign_key="anos_escolares.id_ano", index=True)

    is_active: bool = Field(default=True, index=True)
    created_at: date = Field(default_factory=date.today)

    turno: Optional["Turno"] = Relationship(back_populates="secciones")
    grado: Optional["Grado"] = Relationship(back_populates="secciones")
    docente: Optional["Docente"] = Relationship(back_populates="secciones")
    horarios: List["Horario"] = Relationship(back_populates="seccion")
    ano_escolar: Optional["AnoEscolar"] = Relationship(back_populates="secciones")
    inscripciones: List["Inscripcion"] = Relationship(back_populates="seccion")