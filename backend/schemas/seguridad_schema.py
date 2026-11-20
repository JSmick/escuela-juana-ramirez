from pydantic import BaseModel, Field, EmailStr
from typing import Optional


class PreguntaBase(BaseModel):
    pregunta: str = Field(..., max_length=50)
    is_active: bool = True


class PreguntaRead(PreguntaBase):
    id_pregunta: int

    class Config:
        from_attributes = True




class PreguntaSegCreate(BaseModel):
    id_pre: int
    respuesta_pre: str = Field(..., max_length=100)


class PreguntaSegRead(BaseModel):
    id_pre_seg: int
    id_user: int
    id_pre: int

    class Config:
        from_attributes = True

class PreguntaSegEmailCreate(BaseModel):
    correo_user: str
    id_pre: int
    respuesta_pre: str        


class ValidarRespuesta(BaseModel):
    correo: EmailStr  
    id_pre: int
    respuesta_pre: str = Field(..., max_length=100)


class ResetPasswordConPregunta(BaseModel):
    correo: EmailStr
    id_pre: int
    respuesta_pre: str = Field(..., max_length=100)
    nueva_password: str = Field(..., min_length=6, description="Nueva contraseña para la cuenta")
