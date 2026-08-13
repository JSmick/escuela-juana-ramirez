from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class AnoEscolarBase(BaseModel):
    nombre: str = Field(..., max_length=20, description="Nombre del año escolar (Ej: 2024-2025)")
    fecha_inicio: date = Field(..., description="Fecha de inicio del ciclo escolar")
    fecha_fin: date = Field(..., description="Fecha de cierre del ciclo escolar")
    es_actual: bool = Field(default=False, description="Indica si es el período académico activo")

class AnoEscolarCreate(AnoEscolarBase):
    pass

class AnoEscolarPut(AnoEscolarBase):
    is_active: bool = Field(default=True, description="Estado de activación en el sistema")

class AnoEscolarUpdate(BaseModel):
    nombre: Optional[str] = Field(default=None, max_length=20)
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None
    es_actual: Optional[bool] = None
    is_active: Optional[bool] = None

class AnoEscolarRead(AnoEscolarBase):
    id_ano: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)