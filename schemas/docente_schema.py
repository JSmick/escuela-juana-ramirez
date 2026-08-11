from pydantic import BaseModel, EmailStr , Field
from datetime import date, time
from sqlmodel import SQLModel
from typing import Optional, List
from enum import Enum

# Definir los estados permitidos
class EstadoLaboral(str, Enum):
    activo = "activo"
    inactivo = "inactivo"
    reposo = "reposo"
    permiso = "permiso"

class DocenteRead(BaseModel):
    id_docen: int
    nom: str
    apell: str
    cedula: str
    telef: str
    email: str
    fec_ingre:date

class DocentesRead(BaseModel):
    id_docen: int
    nom: str
    apell: str
    cedula: str
    telef: str
    email: str
    fec_ingre:date
    estado_laboral: str    

class DocenteCreate(BaseModel):
    nom: str
    apell: str
    cedula: str
    telef: str
    email: Optional[EmailStr] = None
    fec_ingre: date
    estado_laboral: EstadoLaboral  

class Docentes(BaseModel):
    nom: str
    apell: str
    telef: str
    email: Optional[EmailStr] = None
    fec_ingre: date
    estado_laboral: EstadoLaboral  

class DocenteUpdate(BaseModel):
    nom: Optional[str] = None
    apell: Optional[str] = None
    telef: Optional[str] = None
    email: Optional[EmailStr] = None
    fec_ingre: Optional[date] = None
    estado_laboral: Optional[EstadoLaboral] = None    
