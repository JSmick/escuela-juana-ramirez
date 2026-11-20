from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from database.connection import get_session
from schemas.asistenciaDocente_schema import (
    AsistenciaDocenteCreate,
    AsistenciaDocenteUpdate,
    AsistenciaDocenteRead
)
from services import asistencia_docente_service


from security.dependencies import require_roles  #

router = APIRouter(prefix="/asistencias-docentes", tags=["Asistencias Docentes"])

@router.post("", response_model=AsistenciaDocenteRead, status_code=status.HTTP_201_CREATED)
def create_asistencia(
    data: AsistenciaDocenteCreate, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2)) 
):
    return asistencia_docente_service.create_asistencia_docente_service(session, data)

@router.get("", response_model=List[AsistenciaDocenteRead])
def get_asistencias(
    skip: int = 0, 
    limit: int = 100, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))  
):
    return asistencia_docente_service.get_asistencias_docentes_service(session, skip, limit)

@router.get("/{id_asistencia}", response_model=AsistenciaDocenteRead)
def get_asistencia_by_id(
    id_asistencia: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))  
):
    return asistencia_docente_service.get_asistencia_docente_by_id_service(session, id_asistencia)

@router.get("/docente/{id_docen}", response_model=List[AsistenciaDocenteRead])
def get_asistencias_por_docente(
    id_docen: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))  
):
    return asistencia_docente_service.get_asistencias_por_docente_service(session, id_docen)

@router.patch("/{id_asistencia}", response_model=AsistenciaDocenteRead)
def update_asistencia(
    id_asistencia: int, 
    data: AsistenciaDocenteUpdate, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2))  
):
    return asistencia_docente_service.update_asistencia_docente_service(session, id_asistencia, data)

@router.delete("/{id_asistencia}")
def delete_asistencia(
    id_asistencia: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))  
):
    return asistencia_docente_service.delete_asistencia_docente_service(session, id_asistencia)