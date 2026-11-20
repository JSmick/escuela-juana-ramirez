from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from database.connection import get_session
from schemas.evento_schema import (
    EventoCreate,
    EventoPut,
    EventoUpdate,
    EventoRead
)
from services import evento_service
from security.dependencies import require_roles  

router = APIRouter(prefix="/eventos", tags=["Eventos"])

@router.post("", response_model=EventoRead, status_code=status.HTTP_201_CREATED)
def create_evento(
    data: EventoCreate, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1)) 
):
    return evento_service.create_evento_service(session, data)

@router.get("", response_model=List[EventoRead])
def get_eventos(
    skip: int = 0, 
    limit: int = 100, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2, 3))
):
    return evento_service.get_eventos_service(session, skip, limit)

@router.get("/{id_evento}", response_model=EventoRead)
def get_evento(
    id_evento: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1)) 
):
    return evento_service.get_evento_by_id_service(session, id_evento)

@router.get("/grado/{id_grado}", response_model=List[EventoRead])
def get_eventos_por_grado(
    id_grado: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))  
):
    return evento_service.get_eventos_por_grado_service(session, id_grado)

@router.put("/{id_evento}", response_model=EventoRead)
def update_evento_complete(
    id_evento: int, 
    data: EventoPut, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1)) 
):
    return evento_service.update_evento_complete_service(session, id_evento, data)

@router.patch("/{id_evento}", response_model=EventoRead)
def update_evento_partial(
    id_evento: int, 
    data: EventoUpdate, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))
):
    return evento_service.update_evento_partial_service(session, id_evento, data)

@router.delete("/{id_evento}")
def delete_evento(
    id_evento: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1)) 
):
    return evento_service.delete_evento_service(session, id_evento)