from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from core.enums import CalificacionLetra

class CalificacionBase(BaseModel):
    id_estudiante: int = Field(..., description="ID del estudiante")
    id_asignatura: int = Field(..., description="ID de la asignatura")
    lapso_periodo: int = Field(..., ge=1, le=3, description="Número del lapso o momento (1, 2 o 3)")
    nota: CalificacionLetra = Field(..., description="Nota literal asignada (A, B, C, D, E)")
    observacion: Optional[str] = Field(default=None, max_length=255, description="Observaciones pedagógicas del docente")

class CalificacionCreate(CalificacionBase):
    pass

class CalificacionPut(CalificacionBase):
    pass

class CalificacionUpdate(BaseModel):
    id_estudiante: Optional[int] = None
    id_asignatura: Optional[int] = None
    lapso_periodo: Optional[int] = Field(default=None, ge=1, le=3)
    nota: Optional[CalificacionLetra] = None
    observacion: Optional[str] = Field(default=None, max_length=255)

class CalificacionRead(CalificacionBase):
    id_calificacion: int
    created_at: date

    model_config = ConfigDict(from_attributes=True)