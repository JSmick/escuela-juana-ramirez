from datetime import date, time
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from core.enums import DetallesEvento

class EventoBase(BaseModel):
    titulo_evento: str = Field(..., max_length=100, description="Título del evento")
    tipo_evento: DetallesEvento = Field(description="Tipo de evento")
    detalles_even: str = Field(..., max_length=100, description="Detalles o descripción del evento")
    fecha_even: date = Field(..., description="Fecha de realización del evento")
    hora_inicio: time = Field(..., description="Hora de inicio (THH:MM:SS)")
    hora_fin: Optional[time] = Field(default=None, description="Hora de fin (THH:MM:SS)")
    id_grado: int = Field(..., description="ID del grado al que pertenece el evento")
    lugar_even: str = Field(..., max_length=100, description="Lugar del evento")


class EventoCreate(EventoBase):
    pass


class EventoPut(EventoBase):
    pass


class EventoUpdate(BaseModel):
    titulo_evento: Optional[str] = Field(default=None, max_length=100)
    tipo_evento: Optional[DetallesEvento] = None
    detalles_even: Optional[int] = Field(default=None, max_length=100)
    fecha_even: Optional[date] = None
    hora_inicio: Optional[time] = None
    hora_fin: Optional[time] = None
    id_grado: Optional[int] = None
    lugar_even: Optional[str] = Field(default=None, max_length=100)
    is_active: Optional[bool] = None


class EventoRead(EventoBase):
    id_evento: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)