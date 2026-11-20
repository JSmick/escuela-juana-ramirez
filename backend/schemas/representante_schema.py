from datetime import date
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from core.enums import ParentescoLegal  # Ajusta la ruta según corresponda
from schemas.estudiante_schema import EstudianteRead  # Ajusta la ruta según corresponda

class RepresentanteBase(BaseModel):
    nom: str = Field(..., max_length=50, description="Nombre del representante")
    apell: str = Field(..., max_length=50, description="Apellido del representante")
    cedula: str = Field(..., max_length=20, description="Cédula de identidad (Única)")
    telef: Optional[str] = Field(default=None, max_length=20, description="Número de teléfono")
    email: Optional[EmailStr] = Field(default=None, description="Correo electrónico (Único)")
    direccion: Optional[str] = Field(default=None, max_length=255, description="Dirección de habitación")
    id_user: int = Field(..., description="ID del usuario vinculado en el sistema")
    parentesco: ParentescoLegal = Field(..., description="Parentesco con el estudiante")


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
    parentesco: Optional[ParentescoLegal] = Field(default=None, description="Parentesco con el estudiante")


class RepresentanteRead(RepresentanteBase):
    id_represen: int
    is_active: bool
    created_at: date
    updated_at: Optional[date] = None

    model_config = ConfigDict(from_attributes=True)

class RepresentanteConEstudiantes(RepresentanteRead):
    estudiantes: List[EstudianteRead] = []