from pydantic import BaseModel, EmailStr , Field
from datetime import date, time
from sqlmodel import SQLModel
from typing import Optional, List
from enum import Enum

class Estatus(str, Enum):
    activo = "activo"
    inactivo = "inactivo"

class RepresentanteRead(BaseModel):
    id_represen: int
    nom: str  
    apell: str
    cedula: str
    telef: str
    direccion: str

class RepresentantesRead(BaseModel):
    id_represen: int
    nom: str  
    apell: str
    cedula: str
    telef: str
    direccion: str
    estatus: str    
###
class RepresentantesCreate(BaseModel):
    nom: str
    apell: str
    cedula: str
    telef: str
    direccion: str
    estatus: Estatus 

class Representante(BaseModel):
    nom: str
    apell: str
    telef: str
    direccion: str
    estatus: Estatus 

class RepresentanteUpdate(BaseModel):
    nom: Optional[str] = None
    apell: Optional[str] = None
    telef: Optional[str] = None
    direccion: Optional[str] = None
    estatus: Optional[Estatus] = None    