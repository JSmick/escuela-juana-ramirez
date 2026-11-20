from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from database.connection import get_session
from schemas.inventario_schema import InventarioCreate, InventarioRead, InventarioUpdate
from services import inventario_service
from security.dependencies import require_roles  

router = APIRouter(
    prefix="/inventario",
    tags=["Inventario"]
)

@router.post("", response_model=InventarioRead, status_code=status.HTTP_201_CREATED)
def crear_inventario(
    inventario_data: InventarioCreate,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))  
):
    return inventario_service.crear_inventario(session, inventario_data)

@router.get("", response_model=List[InventarioRead])
def listar_inventarios(
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))  
):
    return inventario_service.obtener_inventarios(session, skip, limit)

@router.get("/{id_inv}", response_model=InventarioRead)
def obtener_inventario(
    id_inv: int,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))
):
    return inventario_service.obtener_inventario_por_id(session, id_inv)

@router.patch("/{id_inv}", response_model=InventarioRead)
def actualizar_inventario(
    id_inv: int,
    inventario_data: InventarioUpdate,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))
):
    return inventario_service.actualizar_inventario(session, id_inv, inventario_data)

@router.delete("/{id_inv}")
def eliminar_inventario(
    id_inv: int,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))
):
    return inventario_service.delete_inventario(session, id_inv)