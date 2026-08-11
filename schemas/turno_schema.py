from pydantic import BaseModel, EmailStr , Field
from datetime import date, time
from sqlmodel import SQLModel
from typing import Optional, List
from enum import Enum

 
class turnos(str, Enum):
    mañana = "Mañana"
    tarde = "Tarde"
    

class TurnoRead(BaseModel):
    id_turno: int
    descripcion: str

class TurnoCreate(BaseModel):
    descripcion: turnos
    
class TurnosU(BaseModel):
    descripcion: turnos    

class TurnoUpdate(BaseModel):
    descripcion: Optional[turnos] = None

