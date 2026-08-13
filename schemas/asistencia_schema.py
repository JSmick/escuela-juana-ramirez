from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from core.enums import EstadoAsistencia

class AsistenciaBase(BaseModel):
    fecha: date = Field(default_factory=date.today, description="Fecha de toma de asistencia")
    estado: EstadoAsistencia = Field(default=EstadoAsistencia.PRESENTE, description="Estado (Presente, Ausente, Justificado, Cautivo/Tarde)")
    observacion: Optional[str] = Field(default=None, max_length=255, description="Observaciones o justificativo")
    id_estudiante: int = Field(..., description="ID del estudiante")
    id_seccion: int = Field(..., description="ID de la sección")
    id_asignatura: Optional[int] = Field(default=None, description="ID de la asignatura (opcional según el nivel)")

class AsistenciaCreate(AsistenciaBase):
    pass

class AsistenciaPut(AsistenciaBase):
    pass

class AsistenciaUpdate(BaseModel):
    fecha: Optional[date] = None
    estado: Optional[EstadoAsistencia] = None
    observacion: Optional[str] = Field(default=None, max_length=255)
    id_estudiante: Optional[int] = None
    id_seccion: Optional[int] = None
    id_asignatura: Optional[int] = None

class AsistenciaRead(AsistenciaBase):
    id_asistencia: int
    created_at: date

    model_config = ConfigDict(from_attributes=True)