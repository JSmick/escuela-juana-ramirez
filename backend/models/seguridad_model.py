from sqlmodel import SQLModel, Field
from typing import Optional

class Pregunta(SQLModel, table=True):
    __tablename__ = "preguntas"

    id_pregunta: Optional[int] = Field(default=None, primary_key=True)
    pregunta: str = Field(max_length=50)
    
    is_active: bool = Field(default=True)

class PreguntaSeg(SQLModel, table=True):
    __tablename__ = "preguntas_seg"

    id_pre_seg: Optional[int] = Field(default=None, primary_key=True)
    id_user: int = Field(foreign_key="usuario.id_user")
    id_pre: int = Field(foreign_key="preguntas.id_pregunta")
    respuesta_pre: str = Field(max_length=100)
