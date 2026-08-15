from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from database.connection import get_session
from schemas.asignatura_schema import (AsignaturaCreate, AsignaturaPut, AsignaturaRead, AsignaturaUpdate)
from services import asignatura_service

router = APIRouter(
    prefix="/asignaturas",
    tags=["Asignaturas"]
)

@router.post("", response_model=AsignaturaRead, status_code=status.HTTP_201_CREATED)
def create_asignatura(asignatura_data: AsignaturaCreate, session: Session = Depends(get_session)):
    return asignatura_service.create_asignatura(asignatura_data, session)

@router.get("", response_model=List[AsignaturaRead])
def get_asignaturas(skip: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    return asignatura_service.get_asignaturas(session=session, skip=skip, limit=limit)

@router.get("/{id_asign}", response_model=AsignaturaRead)
def get_asignatura(id_asign: int, session: Session = Depends(get_session)):
    return asignatura_service.get_asignatura(id_asign, session)

@router.put("/{id_asign}", response_model=AsignaturaRead)
def update_asignatura_complete(id_asign: int, asignatura_data: AsignaturaPut, session: Session = Depends(get_session)):
    return asignatura_service.update_asignatura_complete(id_asign, asignatura_data, session)

@router.patch("/{id_asign}", response_model=AsignaturaRead)
def update_asignatura_partial(id_asign: int, asignatura_data: AsignaturaUpdate, session: Session = Depends(get_session)):
    return asignatura_service.update_asignatura_partial(id_asign, asignatura_data, session)

@router.delete("/{id_asign}")
def delete_asignatura(id_asign: int, session: Session = Depends(get_session)):
    return asignatura_service.delete_asignatura(id_asign, session)