from pydantic import BaseModel, EmailStr , Field
from datetime import date, time
from sqlmodel import SQLModel
from typing import Optional, List
from enum import Enum


class secciones(str, Enum):
    A = "A"
    B = "B"

class SeccionRead(BaseModel):
    id_seccion: int
    descripcion: str
    id_grado: int
    id_turno: int
    id_docent: int

class SeccionCreate(BaseModel):
    descripcion: secciones
    id_grado: int
    id_turno: int
    id_docent: int

    
class SeccionesU(BaseModel):
    descripcion: secciones
    id_grado: int
    id_turno: int   
    id_docent: int 

class SeccionUpdate(BaseModel):
    descripcion: Optional[secciones] = None
    id_grado: Optional[int] = None
    id_turno: Optional[int] = None
    id_docent: Optional[int] = None

