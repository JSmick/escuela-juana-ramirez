from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from database.connection import get_session
from schemas.aula_schema import (AulaCreate, AulaPut, AulaRead, AulaUpdate)
from services import aula_service

router = APIRouter(
    prefix="/aulas",
    tags=["Aulas"]
)

@router.post("", response_model=AulaRead, status_code=status.HTTP_201_CREATED)
def create_aula(aula_data: AulaCreate, session: Session = Depends(get_session)):
    return aula_service.create_aula(aula_data, session)

@router.get("", response_model=List[AulaRead])
def get_aulas(skip: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    return aula_service.get_aulas(session=session, skip=skip, limit=limit)

@router.get("/{id_aula}", response_model=AulaRead)
def get_aula(id_aula: int, session: Session = Depends(get_session)):
    return aula_service.get_aula(id_aula, session)

@router.put("/{id_aula}", response_model=AulaRead)
def update_aula_complete(id_aula: int, aula_data: AulaPut, session: Session = Depends(get_session)):
    return aula_service.update_aula_complete(id_aula, aula_data, session)

@router.patch("/{id_aula}", response_model=AulaRead)
def update_aula_partial(id_aula: int, aula_data: AulaUpdate, session: Session = Depends(get_session)):
    return aula_service.update_aula_partial(id_aula, aula_data, session)

@router.delete("/{id_aula}")
def delete_aula(id_aula: int, session: Session = Depends(get_session)):
    return aula_service.delete_aula(id_aula, session)