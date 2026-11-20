from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from core.enums import CalificacionLetra, lapsoEscolar

class CalificacionBase(BaseModel):
    id_estudiante: int = Field(..., description="ID del estudiante")
    id_asignatura: int = Field(..., description="ID de la asignatura")
    lapso_periodo: lapsoEscolar = Field(...,  description="Número del lapso o momento ")
    nota: CalificacionLetra = Field(..., description="Nota literal asignada (A, B, C, D, E)")
    observacion: Optional[str] = Field(default=None, max_length=255, description="Observaciones pedagógicas del docente")


class CalificacionCreate(CalificacionBase):
    pass


class CalificacionPut(CalificacionBase):
    pass 


class CalificacionUpdate(BaseModel):
    id_estudiante: Optional[int] = None
    id_asignatura: Optional[int] = None
    lapso_periodo: Optional[lapsoEscolar] = Field(default=None)
    nota: Optional[CalificacionLetra] = None
    observacion: Optional[str] = Field(default=None, max_length=255)
    is_active: Optional[bool] = None


class CalificacionRead(CalificacionBase):
    id_calificacion: int
    created_at: date
    is_active: bool

    model_config = ConfigDict(from_attributes=True)