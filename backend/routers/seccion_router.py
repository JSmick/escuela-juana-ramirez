from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from database.connection import get_session
from schemas.seccion_schema import (
    SeccionCreate,
    SeccionPut,
    SeccionUpdate,
    SeccionRead
)
from services import seccion_service
from security.dependencies import require_roles  

router = APIRouter(prefix="/secciones", tags=["Secciones"])

@router.post("", response_model=SeccionRead, status_code=status.HTTP_201_CREATED)
def create_seccion(
    data: SeccionCreate, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))  
):
    return seccion_service.create_seccion_service(session, data)

@router.get("", response_model=List[SeccionRead])
def get_secciones(
    skip: int = 0, 
    limit: int = 100, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2, 3)) 
):
    return seccion_service.get_secciones_service(session, skip, limit)

@router.get("/{id_seccion}", response_model=SeccionRead)
def get_seccion(
    id_seccion: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1)) 
):
    return seccion_service.get_seccion_by_id_service(session, id_seccion)

@router.put("/{id_seccion}", response_model=SeccionRead)
def update_seccion_complete(
    id_seccion: int, 
    data: SeccionPut, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))  
):
    return seccion_service.update_seccion_complete_service(session, id_seccion, data)

@router.patch("/{id_seccion}", response_model=SeccionRead)
def update_seccion_partial(
    id_seccion: int, 
    data: SeccionUpdate, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))  
):
    return seccion_service.update_seccion_partial_service(session, id_seccion, data)

@router.delete("/{id_seccion}")
def delete_seccion(
    id_seccion: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))  
):
    return seccion_service.delete_seccion_service(session, id_seccion)