from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class EstudianteBase(BaseModel):
    nom: str = Field(..., max_length=50, description="Nombre del estudiante")
    apell: str = Field(..., max_length=50, description="Apellido del estudiante")
    fecha_nac: date = Field(..., description="Fecha de nacimiento")
    id_repre: Optional[int] = Field(default=None, description="ID del representante asociado")

class EstudianteCreate(EstudianteBase):
    pass

class EstudiantePut(EstudianteBase):
    is_active: bool = Field(default=True, description="Estado de activación del estudiante")

class EstudianteUpdate(BaseModel):
    nom: Optional[str] = Field(default=None, max_length=50)
    apell: Optional[str] = Field(default=None, max_length=50)
    fecha_nac: Optional[date] = None
    id_repre: Optional[int] = None
    is_active: Optional[bool] = None

class EstudianteRead(EstudianteBase):
    id_studs: int
    is_active: bool
    created_at: date
    updated_at: Optional[date] = None

    model_config = ConfigDict(from_attributes=True)