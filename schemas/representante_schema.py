from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field

class RepresentanteBase(BaseModel):
    nom: str = Field(..., max_length=50, description="Nombre del representante")
    apell: str = Field(..., max_length=50, description="Apellido del representante")
    cedula: str = Field(..., max_length=20, description="Cédula de identidad (Única)")
    telef: Optional[str] = Field(default=None, max_length=20, description="Número de teléfono")
    email: Optional[EmailStr] = Field(default=None, description="Correo electrónico (Único)")
    direccion: Optional[str] = Field(default=None, max_length=255, description="Dirección de habitación")

class RepresentanteCreate(RepresentanteBase):
    pass

class RepresentantePut(RepresentanteBase):
    is_active: bool = Field(default=True, description="Estado de activación del representante")

class RepresentanteUpdate(BaseModel):
    nom: Optional[str] = Field(default=None, max_length=50)
    apell: Optional[str] = Field(default=None, max_length=50)
    cedula: Optional[str] = Field(default=None, max_length=20)
    telef: Optional[str] = Field(default=None, max_length=20)
    email: Optional[EmailStr] = Field(default=None)
    direccion: Optional[str] = Field(default=None, max_length=255)
    is_active: Optional[bool] = None

class RepresentanteRead(RepresentanteBase):
    id_represen: int
    is_active: bool
    created_at: date
    updated_at: Optional[date] = None

    model_config = ConfigDict(from_attributes=True)