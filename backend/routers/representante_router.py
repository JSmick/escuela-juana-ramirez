from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel import Session

from database.connection import get_session
from schemas.representante_schema import (
    RepresentanteCreate, 
    RepresentantePut, 
    RepresentanteRead, 
    RepresentanteUpdate,
    RepresentanteConEstudiantes
)
from services import representante_service

from security.dependencies import require_roles

router = APIRouter(prefix="/representantes", tags=["Representantes"])

@router.post("", response_model=RepresentanteRead, status_code=status.HTTP_201_CREATED)
def create_representante(
    representante_data: RepresentanteCreate,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 3)) 
):
    return representante_service.create_representante(representante_data, session)

@router.get("", response_model=List[RepresentanteRead])
def get_representantes(
    skip: int = 0, 
    limit: int = 100, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 3))  
):
    return representante_service.get_representantes(session=session, skip=skip, limit=limit)

@router.get("/mi-perfil", response_model=RepresentanteConEstudiantes)
def get_mi_perfil_representante(
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(3))
):
    """Permite al representante logueado ver sus datos y sus estudiantes asociados."""
    user_id = int(current_user.get("sub"))
    representante = representante_service.get_representante_por_usuario(user_id, session)
    if not representante:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontró un perfil de representante asociado. Por favor, registre sus datos."
        )
    return representante

@router.get("/{id_represen}", response_model=RepresentanteRead)
def get_representante(
    id_represen: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 3)) 
):
    return representante_service.get_representante(id_represen, session)


@router.put("/{id_represen}", response_model=RepresentanteRead)
def update_representante_complete(
    id_represen: int,
    representante_data: RepresentantePut,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 3))  
):
    return representante_service.update_representante_complete(id_represen, representante_data, session)

@router.patch("/{id_represen}", response_model=RepresentanteRead)
def update_representante_partial(
    id_represen: int,
    representante_data: RepresentanteUpdate,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 3))  
):
    return representante_service.update_representante_partial(id_represen, representante_data, session)

@router.delete("/{id_represen}")
def delete_representante(
    id_represen: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))  
):
    return representante_service.delete_representante(id_represen, session)