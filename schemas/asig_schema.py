from pydantic import BaseModel, EmailStr , Field
from datetime import date, time
from sqlmodel import SQLModel
from typing import Optional, List
from enum import Enum


class AsigRead(BaseModel):
    descripcion: str

class AsigCreate(BaseModel):
    descripcion: str

class AsigU(BaseModel):
    descripcion: str

class AsigUpdate(BaseModel):
    descripcion: Optional[str] = None

