from pydantic import BaseModel, EmailStr , Field
from datetime import date, time
from sqlmodel import SQLModel
from typing import Optional, List
from enum import Enum


class aulas(str, Enum):
    aula1 = "Aula 1"
    aula2 = "Aula 2"
    aula3 = "Aula 3"


class AulasRead(BaseModel):
    id_aula: int
    descripcion: str

class AulasCreate(BaseModel):
    descripcion: aulas

class AulasU(BaseModel):
    descripcion: aulas

class AulasUpdate(BaseModel):
    descripcion: Optional[aulas] = None

