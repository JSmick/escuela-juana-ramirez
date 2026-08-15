from datetime import date, time
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from core.enums import EstadoAsistencia

class AsistenciaDocenteBase(BaseModel):
    id_docen: int = Field(..., description="ID del docente")
    id_horario: Optional[int] = Field(None, description="ID del horario programado a cumplir")
    fecha: date = Field(default_factory=date.today)
    hora_entrada: Optional[time] = None
    hora_salida: Optional[time] = None
    estado: EstadoAsistencia = EstadoAsistencia.PRESENTE
    observacion: Optional[str] = None

class AsistenciaDocenteCreate(BaseModel):
    id_docen: int
    id_horario: Optional[int] = None
    fecha: date = Field(default_factory=date.today)
    hora_entrada: time
    observacion: Optional[str] = None

class AsistenciaDocenteSalida(BaseModel):
    hora_salida: time
    observacion: Optional[str] = None

class AsistenciaDocenteUpdate(BaseModel):
    hora_entrada: Optional[time] = None
    hora_salida: Optional[time] = None
    estado: Optional[EstadoAsistencia] = None
    observacion: Optional[str] = None

class AsistenciaDocenteRead(AsistenciaDocenteBase):
    id_asistencia_docente: int

    model_config = ConfigDict(from_attributes=True)

class ReporteCumplimientoDocente(BaseModel):
    id_docen: int
    nombre_completo: str
    cedula: str
    total_clases_programadas: int
    clases_asistidas: int
    retardos: int
    inasistencias: int
    porcentaje_cumplimiento: float