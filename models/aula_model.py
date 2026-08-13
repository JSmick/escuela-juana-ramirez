from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from models.horario import Horario

class Aula(SQLModel, table=True):
    __tablename__ = "aulas"

    id_aula: Optional[int] = Field(default=None, primary_key=True)
    descripcion: str = Field(max_length=50, unique=True)
    is_active: bool = Field(default=True, index=True)

    horarios: List["Horario"] = Relationship(back_populates="aula")