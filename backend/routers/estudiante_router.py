from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from database.connection import get_session
from schemas.estudiante_schema import (EstudianteCreate, EstudiantePut, EstudianteRead, EstudianteUpdate, EstudianteAsignarCedula, EstudianteResponse)
from services import estudiante_service
from security.dependencies import require_roles 

router = APIRouter(
    prefix="/estudiantes",
    tags=["Estudiantes"]
)

@router.post("", response_model=EstudianteRead, status_code=status.HTTP_201_CREATED)
def create_estudiante(
    estudiante_data: EstudianteCreate, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 3))  
):
    # Extraemos ID usuario desde el token ( auth_service)ojo
    user_id = int(current_user.get("sub"))
    
    # Si es un Administrador (Rol 1) registrando por alguien más, podrías manejar una lógica distinta, 
    # pero si es el Representante (Rol 3), usará su propio ID.
    return estudiante_service.create_estudiante(estudiante_data, session, user_id)

@router.post("/{id_studs}/reactivar", response_model=EstudianteRead)
def reactivate_estudiante(
    id_studs: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1)) 
):
    return estudiante_service.reactivar_estudiante(id_studs, session)

@router.get("", response_model=List[EstudianteRead])
def get_estudiantes(
    skip: int = 0, 
    limit: int = 100, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2))  
):
    return estudiante_service.get_estudiantes(session=session, skip=skip, limit=limit)

@router.get("/{id_studs}", response_model=EstudianteRead)
def get_estudiante(
    id_studs: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2, 3)) 
):
    return estudiante_service.get_estudiante(id_studs, session)

@router.patch("/{id_studs}/cedula-escolar", response_model=EstudianteResponse)######
def actualizar_cedula_escolar(
    id_studs: int,
    payload: EstudianteAsignarCedula,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))  
):
    """Ruta protegida: Solo el administrador puede asignar o modificar la cédula escolar."""
    return estudiante_service.asignar_cedula_escolar_db(
        db=session, 
        estudiante_id=id_studs, 
        cedula=payload.cedula_esco_cedula
    )

@router.put("/{id_studs}", response_model=EstudianteRead)
def update_estudiante_complete(
    id_studs: int, 
    estudiante_data: EstudiantePut,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 3))  
):
    return estudiante_service.update_estudiante_complete(id_studs, estudiante_data, session)

@router.patch("/{id_studs}", response_model=EstudianteRead)
def update_estudiante_partial(
    id_studs: int, 
    estudiante_data: EstudianteUpdate, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 3)) 
):
    return estudiante_service.update_estudiante_partial(id_studs, estudiante_data, session)

@router.delete("/{id_studs}")
def delete_estudiante(
    id_studs: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))  
):
    return estudiante_service.delete_estudiante(id_studs, session)