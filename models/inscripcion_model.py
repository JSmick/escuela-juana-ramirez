from sqlmodel import SQLModel, Field, Relationship
from datetime import date
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from models.anoEscolar_model import AnoEscolar
    from models.estudiante_model import Estudiante
    from models.seccion_model import Seccion

class Inscripcion(SQLModel, table=True):
    __tablename__ = "inscripciones"

    id_inscripcion: Optional[int] = Field(default=None, primary_key=True)
    id_estudiante: int = Field(foreign_key="estudiantes.id_studs", index=True)
    id_seccion: int = Field(foreign_key="secciones.id_seccion", index=True)
    id_ano_escolar: int = Field(foreign_key="anos_escolares.id_ano", index=True)

    fecha_inscripcion: date = Field(default_factory=date.today)
    is_active: bool = Field(default=True, index=True)

    estudiante: Optional["Estudiante"] = Relationship(back_populates="inscripciones")
    seccion: Optional["Seccion"] = Relationship(back_populates="inscripciones")
    ano_escolar: Optional["AnoEscolar"] = Relationship(back_populates="inscripciones")