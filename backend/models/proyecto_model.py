from sqlmodel import SQLModel, Field
from typing import Optional
from core.enums import EstadoProyecto, lapsoEscolar


class Proyecto(SQLModel, table=True):
    __tablename__ = "proyecto"

    id_proyecto: Optional[int] = Field(default=None, primary_key=True)
    titulo_proyecto: str = Field(max_length=50, nullable=False)
    lapso_ejecu: lapsoEscolar = Field(unique=True, index=True, nullable=False)
    estado_proyec: EstadoProyecto = Field(unique=True, index=True, nullable=False)
    id_docente: int = Field(foreign_key="docentes.id_docen", nullable=False) 
    
    is_active: bool = Field(default=True, index=True)