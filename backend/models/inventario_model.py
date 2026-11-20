from sqlmodel import SQLModel, Field
from typing import Optional
from core.enums import EstadoFisico

class Inventario(SQLModel, table=True):
    __tablename__ = "inventario"

    id_inv: Optional[int] = Field(default=None, primary_key=True)
    codigo: str = Field(nullable=False)
    nombre_inv: str = Field(max_length=20, nullable=False)
    cantidad: Optional[int] = Field(default=None)
    estado_fisico: EstadoFisico = Field(index=True, nullable=False)
    ubicacion: Optional[str] = Field(default=None, max_length=50)
    observacion: Optional[str] = Field(default=None, max_length=100)
    
    is_active: bool = Field(default=True, index=True)