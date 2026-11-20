from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from database.connection import get_session
from schemas.asistencia_schema import (
    AsistenciaCreate,
    AsistenciaPut,
    AsistenciaUpdate,
    AsistenciaRead
)
from services import asistencia_service
from security.dependencies import require_roles

router = APIRouter(prefix="/asistencias", tags=["Asistencias Estudiantes"])

@router.post("", response_model=AsistenciaRead, status_code=status.HTTP_201_CREATED)
def create_asistencia(
    data: AsistenciaCreate, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2))  
):
    return asistencia_service.create_asistencia_service(session, data)

@router.get("", response_model=List[AsistenciaRead])
def get_asistencias(
    skip: int = 0, 
    limit: int = 100, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2))  
):
    return asistencia_service.get_asistencias_service(session, skip, limit)

@router.get("/{id_asistencia}", response_model=AsistenciaRead)
def get_asistencia(
    id_asistencia: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2))  
):
    return asistencia_service.get_asistencia_by_id_service(session, id_asistencia)

@router.get("/estudiante/{id_estudiante}", response_model=List[AsistenciaRead])
def get_asistencias_por_estudiante(
    id_estudiante: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2, 3))
):
    return asistencia_service.get_asistencias_por_estudiante_service(session, id_estudiante)

@router.get("/seccion/{id_seccion}", response_model=List[AsistenciaRead])
def get_asistencias_por_seccion(
    id_seccion: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2))  
):
    return asistencia_service.get_asistencias_por_seccion_service(session, id_seccion)

@router.put("/{id_asistencia}", response_model=AsistenciaRead)
def update_asistencia_complete(
    id_asistencia: int, 
    data: AsistenciaPut, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2))  
):
    return asistencia_service.update_asistencia_complete_service(session, id_asistencia, data)

@router.patch("/{id_asistencia}", response_model=AsistenciaRead)
def update_asistencia_partial(
    id_asistencia: int, 
    data: AsistenciaUpdate, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2))  
):
    return asistencia_service.update_asistencia_partial_service(session, id_asistencia, data)

@router.delete("/{id_asistencia}")
def delete_asistencia(
    id_asistencia: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2))  
):
    return asistencia_service.delete_asistencia_service(session, id_asistencia)