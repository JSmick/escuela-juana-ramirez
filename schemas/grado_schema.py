from pydantic import BaseModel, EmailStr , Field
from datetime import date, time
from sqlmodel import SQLModel
from typing import Optional, List
from enum import Enum


class grados(str, Enum):
    primero = "Primero"
    segundo = "Segundo"
    tercero = "Tercero"
    cuarto = "Cuarto"
    quinto = "Quinto"
    sexto = "Sexto"

class GradoRead(BaseModel):
    id_grad: int
    descripcion: str

class GradoCreate(BaseModel):
    descripcion: grados

class GradosU(BaseModel):
    descripcion: grados    

class GradoUpdate(BaseModel):
    descripcion: Optional[grados] = None

 