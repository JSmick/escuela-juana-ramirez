from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from database.connection import get_session
from schemas.proyecto_schema import ProyectoCreate, ProyectoRead, ProyectoUpdate
from schemas.docente_schema import DocentesRead 
from services import proyecto_services
from security.dependencies import require_roles

router = APIRouter(
    prefix="/proyectos",
    tags=["Proyectos"]
)

@router.post("", response_model=ProyectoRead, status_code=status.HTTP_201_CREATED)
def crear_proyecto(
    proyecto_data: ProyectoCreate,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))  
):
    return proyecto_services.crear_proyecto(session, proyecto_data)

@router.get("", response_model=List[ProyectoRead])
def listar_proyectos(
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 3)) 
):
    return proyecto_services.obtener_proyectos(session, skip, limit)

@router.get("/{id_proyecto}", response_model=ProyectoRead)
def obtener_proyecto(
    id_proyecto: int,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 3))
):
    return proyecto_services.obtener_proyecto_por_id(session, id_proyecto)

@router.patch("/{id_proyecto}", response_model=ProyectoRead)
def actualizar_proyecto(
    id_proyecto: int,
    proyecto_data: ProyectoUpdate,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))
):
    return proyecto_services.actualizar_proyecto(session, id_proyecto, proyecto_data)

@router.put("/{id_proyecto}", response_model=ProyectoRead)
def actualizar_proyecto_completo(
    id_proyecto: int,
        proyecto_data: ProyectoUpdate,
        session: Session = Depends(get_session),
        current_user: dict = Depends(require_roles(1, 3))  
    ):
        return proyecto_services.update_proyecto_complete(id_proyecto, proyecto_data, session)


@router.delete("/{id_proyecto}")
def eliminar_proyecto(
    id_proyecto: int,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))
):
    return proyecto_services.eliminar_proyecto(session, id_proyecto)

@router.get("/docentes/disponibles", response_model=List[DocentesRead]) 
def listar_docentes_para_proyectos(
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 3))
):
    """Devuelve la lista de docentes para ser seleccionados al crear/editar un proyecto."""
    return proyecto_services.obtener_lista_docentes(session, skip, limit)