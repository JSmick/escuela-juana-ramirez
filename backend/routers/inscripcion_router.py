from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session, select
from models.estudiante_model import Estudiante
from models.representante_model import Representante
from database.connection import get_session
from schemas.inscripcion_schema import (
    InscripcionCreate,
    InscripcionPut,
    InscripcionUpdate,
    InscripcionRead
)

from schemas.estudiante_schema import EstudianteRead
from services import inscripcion_service
from services.inscripcion_service import get_estudiantes_por_seccion_service, get_estudiantes_por_grado_service

from security.dependencies import require_roles

router = APIRouter(prefix="/inscripciones", tags=["Inscripciones"])

@router.get("/mis-estudiantes", response_model=List[EstudianteRead])
def get_mis_estudiantes(
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(3))  
):
    user_id = int(current_user.get("sub"))
    
    #id_repre del usuario 
    representante = session.exec(
        select(Representante).where(Representante.id_user == user_id)
    ).first()
    
    if not representante:
        return []

    # estudiantes de este representante
    estudiantes = session.exec(
        select(Estudiante).where(
            Estudiante.id_repre == representante.id_represen,
            Estudiante.is_active == True
        )
    ).all()
    
    return estudiantes

@router.post("", response_model=InscripcionRead, status_code=status.HTTP_201_CREATED)
def create_inscripcion(
    data: InscripcionCreate, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 3))  
):
    user_id = int(current_user.get("sub"))


    return inscripcion_service.create_inscripcion_service(session, data, user_id)

#otro post de incricion pero de admin

@router.get("", response_model=List[InscripcionRead])
def get_inscripciones(
    skip: int = 0, 
    limit: int = 100, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1, 3))  
):
    return inscripcion_service.get_inscripciones_service(session, skip, limit)

@router.get("/seccion/{id_seccion}", response_model=list[EstudianteRead])
def listar_estudiantes_por_seccion(
    id_seccion: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))  
):
    """
    Endpoint para obtener la lista de estudiantes inscritos y activos en una sección específica.
    Ideal para las vistas informativas y para cargar las listas de asistencia.
    """
    return get_estudiantes_por_seccion_service(session, id_seccion)

@router.get("/grado/{id_grado}", response_model=list[EstudianteRead])
def listar_estudiantes_por_grado(
    id_grado: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))  
):
    """
    Endpoint para obtener la lista de estudiantes inscritos y activos en una sección específica.
    Ideal para las vistas informativas y para cargar las listas de asistencia.
    """
    return get_estudiantes_por_grado_service(session, id_grado)

@router.get("/{id_inscripcion}", response_model=InscripcionRead)
def get_inscripcion(
    id_inscripcion: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))  
):
    return inscripcion_service.get_inscripcion_by_id_service(session, id_inscripcion)

@router.put("/{id_inscripcion}", response_model=InscripcionRead)
def update_inscripcion_complete(
    id_inscripcion: int, 
    data: InscripcionPut, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))
):
    return inscripcion_service.update_inscripcion_complete_service(session, id_inscripcion, data)

@router.patch("/{id_inscripcion}", response_model=InscripcionRead)
def update_inscripcion_partial(
    id_inscripcion: int, 
    data: InscripcionUpdate, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1))  
):
    return inscripcion_service.update_inscripcion_partial_service(session, id_inscripcion, data)

@router.delete("/{id_inscripcion}")
def delete_inscripcion(
    id_inscripcion: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles(1)) 
):
    return inscripcion_service.delete_inscripcion_service(session, id_inscripcion)