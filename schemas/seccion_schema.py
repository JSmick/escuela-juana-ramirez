from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class SeccionBase(BaseModel):
    descripcion: str = Field(..., max_length=10, description="Nombre o letra de la sección (Ej: 'A', 'B', 'U')")
    id_turno: int = Field(..., description="ID del turno (Mañana, Tarde, etc.)")
    id_grado: int = Field(..., description="ID del grado académico")
    id_ano_escolar: int = Field(..., description="ID del año escolar lectivo")
    id_docent: Optional[int] = Field(default=None, description="ID del docente guía/titular asignado")

class SeccionCreate(SeccionBase):
    pass

class SeccionPut(SeccionBase):
    is_active: bool = Field(default=True, description="Estado de activación de la sección")

class SeccionUpdate(BaseModel):
    descripcion: Optional[str] = Field(default=None, max_length=10)
    id_turno: Optional[int] = None
    id_grado: Optional[int] = None
    id_ano_escolar: Optional[int] = None
    id_docent: Optional[int] = None
    is_active: Optional[bool] = None

class SeccionRead(SeccionBase):
    id_seccion: int
    is_active: bool
    created_at: date

    model_config = ConfigDict(from_attributes=True)