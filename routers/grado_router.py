from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from database.connection import get_session
from schemas.grado_schema import (GradoCreate, GradoPut, GradoRead, GradoUpdate)
from services import grado_service

router = APIRouter(
    prefix="/grados",
    tags=["Grados"]
)

@router.post("", response_model=GradoRead, status_code=status.HTTP_201_CREATED)
def create_grado(grado_data: GradoCreate, session: Session = Depends(get_session)):
    return grado_service.create_grado(grado_data, session)

@router.get("", response_model=List[GradoRead])
def get_grados(skip: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    return grado_service.get_grados(session=session, skip=skip, limit=limit)

@router.get("/{id_grad}", response_model=GradoRead)
def get_grado(id_grad: int, session: Session = Depends(get_session)):
    return grado_service.get_grado(id_grad, session)

@router.put("/{id_grad}", response_model=GradoRead)
def update_grado_complete(id_grad: int, grado_data: GradoPut, session: Session = Depends(get_session)):
    return grado_service.update_grado_complete(id_grad, grado_data, session)


@router.patch("/{id_grad}", response_model=GradoRead)
def update_grado_partial(id_grad: int, grado_data: GradoUpdate, session: Session = Depends(get_session)):
    return grado_service.update_grado_partial(id_grad, grado_data, session)

@router.delete("/{id_grad}")
def delete_grado(id_grad: int, session: Session = Depends(get_session)):
    return grado_service.delete_grado(id_grad, session)