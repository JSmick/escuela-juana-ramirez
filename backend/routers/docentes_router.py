from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from models.docente_model import Docente
from schemas.docente_schema import DocenteCreate, EstadoLaboral, DocenteBase, DocenteUpdate, DocenteRead, DocentesRead
from database.connection import get_session
from typing import List

from services.docente_service import (
    create_docente_service,
    get_docente_by_cedula_service,
    get_docentes_por_estado_service,
    update_docente_partial_service,
    update_docente_full_service,
    delete_docente_service
)

from security.dependencies import require_roles

router = APIRouter(
    prefix="/docente",
    tags=["Docente"]
) 

@router.get("", response_model=List[DocentesRead])
def get_todos_los_docentes(
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 2))
):
    return session.exec(select(Docente)).all()
 
@router.post("", response_model=DocenteRead, status_code=201)
def create_docente(
    docente_data: DocenteCreate, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))
):
    return create_docente_service(session, docente_data)

@router.get("/cedula/{cedula}", response_model=DocenteRead)
def get_docente(
    cedula: str, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))
):
    docente = get_docente_by_cedula_service(session, cedula)
    if not docente:
        raise HTTPException(status_code=404, detail="Docente no encontrado")
    return docente

@router.get("/estado/{estado}", response_model=List[DocentesRead])
def get_docentes_por_estado(
    estado: EstadoLaboral, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))
):
    return get_docentes_por_estado_service(session, estado)

@router.patch("/{cedula}", response_model=DocenteRead)
def update_docente_patch(
    cedula: str, 
    docente_data: DocenteUpdate, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))
):
    docente = update_docente_partial_service(session, cedula, docente_data)
    if not docente:
        raise HTTPException(status_code=404, detail="Docente no encontrado")
    return docente

@router.put("/{cedula}", response_model=DocenteRead)
def update_docente_put(
    cedula: str, 
    docente_data: DocenteBase, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))
):
    docente = update_docente_full_service(session, cedula, docente_data)
    if not docente:
        raise HTTPException(status_code=404, detail="Docente no encontrado")
    return docente

@router.delete("/{cedula}")
def delete_docente(
    cedula: str, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))
):
    docente = delete_docente_service(session, cedula)
    if not docente:
        raise HTTPException(status_code=404, detail="Docente no encontrado")
    return {"message": "Docente inactivado exitosamente"}