from sqlmodel import SQLModel, Field, Relationship
from datetime import date
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from models.estudiante_model import Estudiante

class Representante(SQLModel, table=True):
    __tablename__ = "representantes"

    id_represen: Optional[int] = Field(default=None, primary_key=True)
    nom: str = Field(max_length=50)
    apell: str = Field(max_length=50)
    cedula: str = Field(unique=True, index=True, max_length=20)
    telef: Optional[str] = Field(default=None, max_length=20)
    email: Optional[str] = Field(default=None, unique=True, index=True, max_length=100)
    direccion: Optional[str] = Field(default=None, max_length=255)
    is_active: bool = Field(default=True, index=True)

    created_at: date = Field(default_factory=date.today)
    updated_at: Optional[date] = Field(default=None)

    estudiantes: List["Estudiante"] = Relationship(back_populates="representante")