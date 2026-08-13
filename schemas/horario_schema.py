from datetime import time
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from core.enums import DiaSemana

class HorarioBase(BaseModel):
    dia: DiaSemana = Field(..., description="Día de la semana asignado (Lunes a Viernes/Sábado)")
    hora_inicio: time = Field(..., description="Hora de inicio del bloque de clase (HH:MM:SS)")
    hora_fin: time = Field(..., description="Hora de culminación del bloque de clase (HH:MM:SS)")
    id_docent: int = Field(..., description="ID del docente asignado")
    id_aula: int = Field(..., description="ID del aula asignada")
    id_seccion: int = Field(..., description="ID de la sección")
    id_asig: int = Field(..., description="ID de la asignatura")

class HorarioCreate(HorarioBase):
    pass

class HorarioPut(HorarioBase):
    is_active: bool = Field(default=True, description="Estado de activación del bloque de horario")

class HorarioUpdate(BaseModel):
    dia: Optional[DiaSemana] = None
    hora_inicio: Optional[time] = None
    hora_fin: Optional[time] = None
    id_docent: Optional[int] = None
    id_aula: Optional[int] = None
    id_seccion: Optional[int] = None
    id_asig: Optional[int] = None
    is_active: Optional[bool] = None

class HorarioRead(HorarioBase):
    id_horario: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)