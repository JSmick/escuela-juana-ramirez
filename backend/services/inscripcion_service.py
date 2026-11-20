from sqlmodel import Session, select
from fastapi import HTTPException
from typing import Optional

from models.inscripcion_model import Inscripcion
from models.estudiante_model import Estudiante
from models.representante_model import Representante
from models.seccion_model import Seccion
from models.anoEscolar_model import AnoEscolar
from models.grado_model import Grado

from schemas.inscripcion_schema import InscripcionCreate, InscripcionPut, InscripcionUpdate
###
def _validar_foraneas(session: Session, id_estudiante: int, id_seccion: int, id_grado: int, id_ano_escolar: int):
    """Verifica que existan el estudiante, la sección y el año escolar."""
    if not session.get(Estudiante, id_estudiante):
        raise HTTPException(status_code=404, detail="El estudiante especificado no existe.")
    if not session.get(Seccion, id_seccion):
        raise HTTPException(status_code=404, detail="La sección especificada no existe.")
    if not session.get(Grado, id_grado):
        raise HTTPException(status_code=404,  detail="El grado especificado no existe.")
    if not session.get(AnoEscolar, id_ano_escolar):
        raise HTTPException(status_code=404, detail="El año escolar especificado no existe.")

def _validar_duplicidad_inscripcion(session: Session, id_estudiante: int, id_ano_escolar: int, exclude_id: Optional[int] = None):
    """Evita que un estudiante se inscriba dos veces en el mismo año escolar."""
    query = select(Inscripcion).where(
        Inscripcion.id_estudiante == id_estudiante,
        Inscripcion.id_ano_escolar == id_ano_escolar,
        Inscripcion.is_active == True
    )
    if exclude_id is not None:
        query = query.where(Inscripcion.id_inscripcion != exclude_id)
        
    if session.exec(query).first():
        raise HTTPException(
            status_code=400,
            detail="El estudiante ya se encuentra inscrito en este año escolar."
        )

def create_inscripcion_service(session: Session, data: InscripcionCreate, user_id: int):

    representante = session.exec(
        select(Representante).where(Representante.id_user == user_id)
    ).first()
    
    if not representante:
        raise HTTPException(status_code=403, detail="No se encontró un perfil de representante activo.")

    estudiante = session.exec(
        select(Estudiante).where(
            Estudiante.id_studs == data.id_estudiante,
            Estudiante.id_repre == representante.id_represen,
            Estudiante.is_active == True
        )
    ).first()

    # Si la consulta no devuelve nada, significa que intentó inscribir a un estudiante ajeno
    if not estudiante:
        raise HTTPException(
            status_code=400, 
            detail="El estudiante seleccionado no existe, está inactivo o no pertenece a tu cuenta de representante."
        )

    _validar_duplicidad_inscripcion(session, data.id_estudiante, data.id_ano_escolar)

    # 3. Si todo es correcto, se procede a guardar la inscripción con total seguridad
    nueva_inscripcion = Inscripcion(
        id_estudiante=data.id_estudiante,
        id_seccion=data.id_seccion,
        id_grado=data.id_grado,
        id_ano_escolar=data.id_ano_escolar,
        is_active=True
    )
    session.add(nueva_inscripcion)
    session.commit()
    session.refresh(nueva_inscripcion)
    return nueva_inscripcion

def get_inscripciones_service(session: Session, skip: int = 0, limit: int = 100) -> list[Inscripcion]:
    return session.exec(select(Inscripcion).where(Inscripcion.is_active == True).offset(skip).limit(limit)).all()

def get_estudiantes_por_seccion_service(session: Session, id_seccion: int):
    statement = (
        select(Estudiante)
        .join(Inscripcion, Estudiante.id_studs == Inscripcion.id_estudiante)
        .where(Inscripcion.id_seccion == id_seccion, Inscripcion.is_active == True)
    )
    return session.exec(statement).all()

def get_estudiantes_por_grado_service(session: Session, id_grado: int):
    statement = (
        select(Estudiante)
        .join(Inscripcion, Estudiante.id_studs == Inscripcion.id_estudiante)
        .where(Inscripcion.id_grado == id_grado, Inscripcion.is_active == True)
    )
    return session.exec(statement).all()


def get_inscripcion_by_id_service(session: Session, id_inscripcion: int) -> Inscripcion:
    inscripcion = session.get(Inscripcion, id_inscripcion)
    if not inscripcion or not inscripcion.is_active:
        raise HTTPException(status_code=404, detail="Inscripción no encontrada o inactiva.")
    return inscripcion


def update_inscripcion_complete_service(session: Session, id_inscripcion: int, data: InscripcionPut) -> Inscripcion:
    inscripcion = session.get(Inscripcion, id_inscripcion)
    if not inscripcion:
        raise HTTPException(status_code=404, detail="Inscripción no encontrada.")

    _validar_foraneas(session, data.id_estudiante, data.id_seccion, data.id_grado, data.id_ano_escolar)
    _validar_duplicidad_inscripcion(session, data.id_estudiante, data.id_ano_escolar, exclude_id=id_inscripcion)

    update_dict = data.model_dump()
    for key, value in update_dict.items():
        setattr(inscripcion, key, value)

    session.add(inscripcion)
    session.commit()
    session.refresh(inscripcion)
    return inscripcion

def update_inscripcion_partial_service(session: Session, id_inscripcion: int, data: InscripcionUpdate) -> Inscripcion:
    inscripcion = session.get(Inscripcion, id_inscripcion)
    if not inscripcion:
        raise HTTPException(status_code=404, detail="Inscripción no encontrada.")

    update_dict = data.model_dump(exclude_unset=True)

    id_est = update_dict.get("id_estudiante", inscripcion.id_estudiante)
    id_sec = update_dict.get("id_seccion", inscripcion.id_seccion)
    id_gra = update_dict.get("id_grado", inscripcion.id_grado)
    id_ano = update_dict.get("id_ano_escolar", inscripcion.id_ano_escolar)

    if "id_estudiante" in update_dict or "id_seccion" in update_dict or "id_ano_escolar" in update_dict:
        _validar_foraneas(session, id_est, id_sec, id_gra, id_ano)

    if "id_estudiante" in update_dict or "id_ano_escolar" in update_dict:
        _validar_duplicidad_inscripcion(session, id_est, id_ano, exclude_id=id_inscripcion)

    for key, value in update_dict.items():
        setattr(inscripcion, key, value)

    session.add(inscripcion)
    session.commit()
    session.refresh(inscripcion)
    return inscripcion

def delete_inscripcion_service(session: Session, id_inscripcion: int):
    inscripcion = session.get(Inscripcion, id_inscripcion)
    if not inscripcion or not inscripcion.is_active:
        raise HTTPException(status_code=404, detail="Inscripción no encontrada o ya inactiva.")

    inscripcion.is_active = False
    session.add(inscripcion)
    session.commit()
    return {"message": "Inscripción inactivada exitosamente"}