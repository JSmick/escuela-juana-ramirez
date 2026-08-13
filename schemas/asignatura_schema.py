from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class AsignaturaBase(BaseModel):
    descripcion: str = Field(..., max_length=100, description="Nombre o descripción de la asignatura (Ej: Matemática)")

class AsignaturaCreate(AsignaturaBase):
    pass

class AsignaturaPut(AsignaturaBase):
    is_active: bool = Field(default=True, description="Estado de activación en el sistema")

class AsignaturaUpdate(BaseModel):
    descripcion: Optional[str] = Field(default=None, max_length=100)
    is_active: Optional[bool] = None

class AsignaturaRead(AsignaturaBase):
    id_asign: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)