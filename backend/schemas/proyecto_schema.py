from pydantic import BaseModel, Field
from typing import Optional
from core.enums import  lapsoEscolar, EstadoProyecto

class ProyectoCreate(BaseModel):
    titulo_proyecto: str = Field(..., max_length=50)
    lapso_ejecu: lapsoEscolar = Field(..., description="Lapso escolar en el que se ejecuta el proyecto")
    estado_proyec: EstadoProyecto = Field(..., description="Estado del proyecto (En Proceso, Finalizado, Cancelado)")
    id_docente: int


class Proyectoput(ProyectoCreate):
    is_active: bool = Field(default=True, description="Estado de activación del proyecto")    


class ProyectoUpdate(ProyectoCreate):
    is_active: Optional[bool] = None


class ProyectoRead(ProyectoCreate):
    id_proyecto: int
    is_active: bool

    class Config:
        from_attributes = True