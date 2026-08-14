from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class InscripcionBase(BaseModel):
    id_estudiante: int = Field(..., description="ID del estudiante a inscribir")
    id_seccion: int = Field(..., description="ID de la sección asignada")
    id_ano_escolar: int = Field(..., description="ID del año escolar lectivo")
    fecha_inscripcion: date = Field(default_factory=date.today, description="Fecha de realización del trámite")

class InscripcionCreate(InscripcionBase):
    pass

class InscripcionPut(InscripcionBase):
    is_active: bool = Field(default=True, description="Estado de activación del registro de inscripción")

class InscripcionUpdate(BaseModel):
    id_estudiante: Optional[int] = None
    id_seccion: Optional[int] = None
    id_ano_escolar: Optional[int] = None
    fecha_inscripcion: Optional[date] = None
    is_active: Optional[bool] = None

class InscripcionRead(InscripcionBase):
    id_inscripcion: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)