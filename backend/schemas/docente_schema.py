from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from core.enums import EstadoLaboral

class DocenteBase(BaseModel):
    nom: str = Field(..., max_length=50)
    apell: str = Field(..., max_length=50)
    cedula: str = Field(..., max_length=20)
    telef: Optional[str] = Field(default=None, max_length=20)
    email: Optional[EmailStr] = Field(default=None)
    fec_ingre: Optional[date] = Field(default_factory=date.today)
    estado_laboral: EstadoLaboral = Field(default=EstadoLaboral.ACTIVO)
    direccion: Optional[str] = Field(default=None, max_length=50)
    titulo_academico: str = Field(..., max_length=20)
    
    # Credenciales automáticas para la tabla usuarios
    password_temporal: Optional[str] = Field(default=None, description="Contraseña inicial para el sistema del docente")
    
class DocenteCreate(DocenteBase):
    pass

class DocentePut(DocenteBase):
    is_active: bool = Field(default=True, description="Estado de activación del docente")

class DocenteUpdate(BaseModel):
    nom: Optional[str] = Field(default=None, max_length=50)
    apell: Optional[str] = Field(default=None, max_length=50)
    cedula: Optional[str] = Field(default=None, max_length=20)
    telef: Optional[str] = Field(default=None, max_length=20)
    email: Optional[EmailStr] = Field(default=None)
    fec_ingre: Optional[date] = None
    estado_laboral: Optional[EstadoLaboral] = None
    is_active: Optional[bool] = None
    direccion: Optional[str] = Field(default=None, max_length=50)
    titulo_academico: Optional[str] = Field(default=None, max_length=20)
    

class DocenteRead(DocenteBase):
    id_docen: int
    id_user: int
    is_active: bool
    created_at: date
    updated_at: Optional[date] = None

    model_config = ConfigDict(from_attributes=True)

class DocentesRead(BaseModel):
    id_docen: int
    id_user: int 
    nom: str
    apell: str
    cedula: str
    email: str
    telef: Optional[str] = None
    direccion: Optional[str] = None      
    titulo_academico: str
    is_active: bool
    
    class Config:
        from_attributes = True    