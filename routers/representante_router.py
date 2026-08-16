from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from database.connection import get_session
from schemas.representante_schema import (RepresentanteCreate, RepresentantePut, RepresentanteRead, RepresentanteUpdate)
from services import representante_service

router = APIRouter(prefix="/representantes", tags=["Representantes"])

@router.post("", response_model=RepresentanteRead, status_code=status.HTTP_201_CREATED)
def create_representante(representante_data: RepresentanteCreate,session: Session = Depends(get_session)):
    return representante_service.create_representante(representante_data, session)

@router.get("", response_model=List[RepresentanteRead])
def get_representantes(skip: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    return representante_service.get_representantes(session=session, skip=skip, limit=limit)

@router.get("/{id_represen}", response_model=RepresentanteRead)
def get_representante(id_represen: int, session: Session = Depends(get_session)):
    return representante_service.get_representante(id_represen, session)

@router.put("/{id_represen}", response_model=RepresentanteRead)
def update_representante_complete(id_represen: int,representante_data: RepresentantePut,session: Session = Depends(get_session)):
    return representante_service.update_representante_complete(id_represen, representante_data, session)

@router.patch("/{id_represen}", response_model=RepresentanteRead)
def update_representante_partial(id_represen: int,representante_data: RepresentanteUpdate,session: Session = Depends(get_session)):
    return representante_service.update_representante_partial(id_represen, representante_data, session)

@router.delete("/{id_represen}")
def delete_representante(id_represen: int, session: Session = Depends(get_session)):
    return representante_service.delete_representante(id_represen, session)