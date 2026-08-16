from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from database.connection import get_session
from schemas.estudiante_schema import (EstudianteCreate, EstudiantePut, EstudianteRead, EstudianteUpdate)
from services import estudiante_service

router = APIRouter(
    prefix="/estudiantes",
    tags=["Estudiantes"]
)

@router.post("", response_model=EstudianteRead, status_code=status.HTTP_201_CREATED)
def create_estudiante(estudiante_data: EstudianteCreate, session: Session = Depends(get_session)):
    return estudiante_service.create_estudiante(estudiante_data, session)

@router.post("/{id_studs}/reactivar", response_model=EstudianteRead)
def reactivate_estudiante(id_studs: int, session: Session = Depends(get_session)):
    return estudiante_service.reactivar_estudiante(id_studs, session)

@router.get("", response_model=List[EstudianteRead])
def get_estudiantes(skip: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    return estudiante_service.get_estudiantes(session=session, skip=skip, limit=limit)

@router.get("/{id_studs}", response_model=EstudianteRead)
def get_estudiante(id_studs: int, session: Session = Depends(get_session)):
    return estudiante_service.get_estudiante(id_studs, session)

@router.put("/{id_studs}", response_model=EstudianteRead)
def update_estudiante_complete(id_studs: int, estudiante_data: EstudiantePut,session: Session = Depends(get_session)):
    return estudiante_service.update_estudiante_complete(id_studs, estudiante_data, session)


@router.patch("/{id_studs}", response_model=EstudianteRead)
def update_estudiante_partial(id_studs: int, estudiante_data: EstudianteUpdate, session: Session = Depends(get_session)):
    return estudiante_service.update_estudiante_partial(id_studs, estudiante_data, session)

@router.delete("/{id_studs}")
def delete_estudiante(id_studs: int, session: Session = Depends(get_session)):
    return estudiante_service.delete_estudiante(id_studs, session)