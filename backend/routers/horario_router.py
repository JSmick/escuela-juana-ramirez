from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from database.connection import get_session
from schemas.horario_schema import (
    HorarioCreate,
    HorarioPut,
    HorarioUpdate,
    HorarioRead
)
from services import horario_service

from security.dependencies import require_roles 

router = APIRouter(prefix="/horarios", tags=["Horarios"])

@router.post("", response_model=HorarioRead, status_code=status.HTTP_201_CREATED)
def create_horario(
    data: HorarioCreate, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1)) 
):
    return horario_service.create_horario_service(session, data)

@router.get("", response_model=List[HorarioRead])
def get_horarios(
    skip: int = 0, 
    limit: int = 100, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2))  
):
    return horario_service.get_horarios_service(session, skip, limit)

@router.get("/{id_horario}", response_model=HorarioRead)
def get_horario(
    id_horario: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2, 3))  
):
    return horario_service.get_horario_by_id_service(session, id_horario)

@router.get("/docente/{id_docent}", response_model=List[HorarioRead])
def get_horarios_por_docente(
    id_docent: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2, 3)) 
):
    return horario_service.get_horarios_por_docente_service(session, id_docent)

@router.put("/{id_horario}", response_model=HorarioRead)
def update_horario_complete(
    id_horario: int, 
    data: HorarioPut, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1)) 
):
    return horario_service.update_horario_complete_service(session, id_horario, data)

@router.patch("/{id_horario}", response_model=HorarioRead)
def update_horario_partial(
    id_horario: int, 
    data: HorarioUpdate, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))  
):
    return horario_service.update_horario_partial_service(session, id_horario, data)

@router.delete("/{id_horario}")
def delete_horario(
    id_horario: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))  
):
    return horario_service.delete_horario_service(session, id_horario)