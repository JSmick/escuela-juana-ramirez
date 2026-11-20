from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from database.connection import get_session
from schemas.anoEscolar_schema import (
    AnoEscolarCreate,
    AnoEscolarPut,
    AnoEscolarUpdate,
    AnoEscolarRead
)
from services import ano_escolar_service
from security.dependencies import require_roles  

router = APIRouter(prefix="/anos-escolares", tags=["Años Escolares"])

@router.post("", response_model=AnoEscolarRead, status_code=status.HTTP_201_CREATED)
def create_ano_escolar(
    data: AnoEscolarCreate, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1)) 
):
    return ano_escolar_service.create_ano_escolar_service(session, data)

@router.get("", response_model=List[AnoEscolarRead])
def get_anos_escolares(
    skip: int = 0, 
    limit: int = 100, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2, 3))  
):
    return ano_escolar_service.get_anos_escolares_service(session, skip, limit)

@router.get("/{id_ano}", response_model=AnoEscolarRead)
def get_ano_escolar(
    id_ano: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1)) 
):
    return ano_escolar_service.get_ano_escolar_by_id_service(session, id_ano)

@router.put("/{id_ano}", response_model=AnoEscolarRead)
def update_ano_escolar_complete(
    id_ano: int, 
    data: AnoEscolarPut, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1)) 
):
    return ano_escolar_service.update_ano_escolar_complete_service(session, id_ano, data)

@router.patch("/{id_ano}", response_model=AnoEscolarRead)
def update_ano_escolar_partial(
    id_ano: int, 
    data: AnoEscolarUpdate, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))
):
    return ano_escolar_service.update_ano_escolar_partial_service(session, id_ano, data)

@router.delete("/{id_ano}")
def delete_ano_escolar(
    id_ano: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1)) 
):
    return ano_escolar_service.delete_ano_escolar_service(session, id_ano)