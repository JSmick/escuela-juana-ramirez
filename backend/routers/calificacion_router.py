from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from database.connection import get_session
from schemas.calificacion_schema import (
    CalificacionCreate,
    CalificacionPut,
    CalificacionUpdate,
    CalificacionRead
)
from services import calificacion_service
from security.dependencies import require_roles  

router = APIRouter(prefix="/calificaciones", tags=["Calificaciones"])

@router.post("", response_model=CalificacionRead, status_code=status.HTTP_201_CREATED)
def create_calificacion(
    data: CalificacionCreate, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2)) 
):
    return calificacion_service.create_calificacion_service(session, data)

@router.get("", response_model=List[CalificacionRead])
def get_calificaciones(
    skip: int = 0, 
    limit: int = 100, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2)) 
):
    return calificacion_service.get_calificaciones_service(session, skip, limit)

@router.get("/{id_calificacion}", response_model=CalificacionRead)
def get_calificacion(
    id_calificacion: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2)) 
):
    return calificacion_service.get_calificacion_by_id_service(session, id_calificacion)

@router.get("/estudiante/{id_estudiante}", response_model=List[CalificacionRead])
def get_calificaciones_por_estudiante(
    id_estudiante: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2, 3))  
):
    return calificacion_service.get_calificaciones_por_estudiante_service(session, id_estudiante)

@router.put("/{id_calificacion}", response_model=CalificacionRead)
def update_calificacion_complete(
    id_calificacion: int, 
    data: CalificacionPut, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2)) 
):
    return calificacion_service.update_calificacion_complete_service(session, id_calificacion, data)

@router.patch("/{id_calificacion}", response_model=CalificacionRead)
def update_calificacion_partial(
    id_calificacion: int, 
    data: CalificacionUpdate, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2)) 
):
    return calificacion_service.update_calificacion_partial_service(session, id_calificacion, data)

@router.delete("/{id_calificacion}")
def delete_calificacion(
    id_calificacion: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2)) 
):
    return calificacion_service.delete_calificacion_service(session, id_calificacion)