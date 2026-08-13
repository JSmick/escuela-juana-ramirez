from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class AulaBase(BaseModel):
    descripcion: str = Field(..., max_length=50, description="Identificador o nombre del aula (Ej: Aula 101, Laboratorio de Computación)")

class AulaCreate(AulaBase):
    pass

class AulaPut(AulaBase):
    is_active: bool = Field(default=True, description="Estado de activación en el sistema")

class AulaUpdate(BaseModel):
    descripcion: Optional[str] = Field(default=None, max_length=50)
    is_active: Optional[bool] = None

class AulaRead(AulaBase):
    id_aula: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

