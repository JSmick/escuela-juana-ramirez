from sqlmodel import SQLModel, Field, Relationship
from datetime import date
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from models.seccion import Seccion

class AnoEscolar(SQLModel, table=True):
    __tablename__ = "anos_escolares"

    id_ano: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=20, unique=True)
    fecha_inicio: date
    fecha_fin: date
    es_actual: bool = Field(default=False, index=True)
    is_active: bool = Field(default=True, index=True)

    secciones: List["Seccion"] = Relationship(back_populates="ano_escolar")