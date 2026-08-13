from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class TurnoBase(BaseModel):
    descripcion: str = Field(..., max_length=50, description="Descripción del turno (Ej: 'Mañana', 'Tarde', 'Noche')")

class TurnoCreate(TurnoBase):
    pass

class TurnoPut(TurnoBase):
    is_active: bool = Field(default=True, description="Estado de activación en el sistema")

class TurnoUpdate(BaseModel):
    descripcion: Optional[str] = Field(default=None, max_length=50)
    is_active: Optional[bool] = None

class TurnoRead(TurnoBase):
    id_turno: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)