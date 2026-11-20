from pydantic import BaseModel, Field
from typing import Optional
from core.enums import EstadoFisico

class InventarioCreate(BaseModel):
    codigo: str
    nombre_inv: str = Field(..., max_length=20)
    cantidad: Optional[int] = None
    estado_fisico: EstadoFisico = Field(..., description="Estado físico del inventario")
    ubicacion: Optional[str] = Field(None, max_length=50)
    observacion: Optional[str] = Field(None, max_length=100)


class InventarioPut(InventarioCreate):
    is_active: bool = Field(default=True, description="Estado de activación del inventario")


class InventarioUpdate(InventarioCreate):
    is_active: Optional[bool] = None


class InventarioRead(InventarioCreate):
    id_inv: int
    is_active: bool

    class Config:
        from_attributes = True