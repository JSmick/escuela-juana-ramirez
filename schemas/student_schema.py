from pydantic import BaseModel, EmailStr , Field
from datetime import date, time
from sqlmodel import SQLModel
from typing import Optional, List
from enum import Enum


class EstadoAcademico(str, Enum):
    activo = "activo"
    inactivo = "inactivo"
    graduado = "graduado"
    retirado = "retirado"

class EstudianteRead(BaseModel):
    id_studs: int
    nom: str
    apell: str
    fecha_nac: date
    id_repre: int

class EstudianteCreate(BaseModel):
    nom: str
    apell: str
    fecha_nac: date
    id_repre: int
    estado_academico: EstadoAcademico 

class Estudiantes(BaseModel):
    nom: str
    apell: str
    fecha_nac: date
    id_repre: int
    estado_academico: EstadoAcademico 

class EstudianteUpdate(BaseModel):
    nom: Optional[str] = None
    apell: Optional[str] = None
    fecha_nac: Optional[date] = None
    id_repre: Optional[int] = None
    estado_academico: Optional[EstadoAcademico] = None
    