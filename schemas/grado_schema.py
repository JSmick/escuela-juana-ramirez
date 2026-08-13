from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from core.enums import NivelGrado

class GradoBase(BaseModel):
    descripcion: NivelGrado = Field(..., description="Grado académico (de 1er Grado a 6to Grado)")

class GradoCreate(GradoBase):
    pass

class GradoPut(GradoBase):
    is_active: bool = Field(default=True, description="Estado de activación del grado")

class GradoUpdate(BaseModel):
    descripcion: Optional[NivelGrado] = None
    is_active: Optional[bool] = None

class GradoRead(GradoBase):
    id_grad: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)