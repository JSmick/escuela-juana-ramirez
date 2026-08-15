from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from database.connection import get_session
from schemas.turno_schema import (TurnoCreate, TurnoPut, TurnoRead, TurnoUpdate)
from services import turno_service

router = APIRouter(
    prefix="/turnos",
    tags=["Turnos"]
)

@router.post("", response_model=TurnoRead, status_code=status.HTTP_201_CREATED)
def create_turno(turno_data: TurnoCreate, session: Session = Depends(get_session)):
    return turno_service.create_turno(turno_data, session)

@router.get("", response_model=List[TurnoRead])
def get_turnos(skip: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    return turno_service.get_turnos(skip, limit, session)

@router.get("/{id_turno}", response_model=TurnoRead)
def get_turno(id_turno: int, session: Session = Depends(get_session)):
    return turno_service.get_turno(id_turno, session)

@router.put("/{id_turno}", response_model=TurnoRead)
def update_turno_complete(id_turno: int, turno_data: TurnoPut, session: Session = Depends(get_session)):
    return turno_service.update_turno_complete(id_turno, turno_data, session)

@router.patch("/{id_turno}", response_model=TurnoRead)
def update_turno_partial(id_turno: int, turno_data: TurnoUpdate, session: Session = Depends(get_session)):
    return turno_service.update_turno_partial(id_turno, turno_data, session)

@router.delete("/{id_turno}")
def delete_turno(id_turno: int, session: Session = Depends(get_session)):
    return turno_service.delete_turno(id_turno, session)