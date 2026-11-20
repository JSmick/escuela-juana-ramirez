from sqlmodel import Session, select
from fastapi import HTTPException, status
from typing import Optional
from models.calificacion_model import Calificacion
from models.estudiante_model import Estudiante
from models.asignatura_model import Asignatura
from schemas.calificacion_schema import CalificacionCreate, CalificacionPut, CalificacionUpdate

def _validar_foraneas(session: Session, id_estudiante: int, id_asignatura: int):
    """Verifica que existan el estudiante y la asignatura."""
    if not session.get(Estudiante, id_estudiante):
        raise HTTPException(status_code=404, detail="El estudiante especificado no existe.")
    if not session.get(Asignatura, id_asignatura):
        raise HTTPException(status_code=404, detail="La asignatura especificada no existe.")

def _validar_duplicidad_calificacion(
    session: Session, 
    id_estudiante: int, 
    id_asignatura: int, 
    lapso_periodo: str, 
    exclude_id: Optional[int] = None
):
    """Evita registrar dos calificaciones para la misma materia y estudiante en el mismo lapso."""
    query = select(Calificacion).where(
        Calificacion.id_estudiante == id_estudiante,
        Calificacion.id_asignatura == id_asignatura,
        Calificacion.lapso_periodo == lapso_periodo
    )
    if exclude_id is not None:
        query = query.where(Calificacion.id_calificacion != exclude_id)
        
    if session.exec(query).first():
        raise HTTPException(
            status_code=400,
            detail="Ya existe una calificación registrada para este estudiante en esta asignatura para el lapso seleccionado."
        )

def create_calificacion_service(session: Session, data: CalificacionCreate) -> Calificacion:
    _validar_foraneas(session, data.id_estudiante, data.id_asignatura)
    _validar_duplicidad_calificacion(session, data.id_estudiante, data.id_asignatura, data.lapso_periodo)

    db_calificacion = Calificacion(**data.model_dump())
    session.add(db_calificacion)
    session.commit()
    session.refresh(db_calificacion)
    return db_calificacion

def get_calificaciones_service(session: Session, skip: int = 0, limit: int = 100) -> list[Calificacion]:
    return session.exec(select(Calificacion).offset(skip).limit(limit)).all()

def get_calificacion_by_id_service(session: Session, id_calificacion: int) -> Calificacion:
    calificacion = session.get(Calificacion, id_calificacion)
    if not calificacion:
        raise HTTPException(status_code=404, detail="Calificación no encontrada.")
    return calificacion

def get_calificaciones_por_estudiante_service(session: Session, id_estudiante: int) -> list[Calificacion]:
    return session.exec(select(Calificacion).where(Calificacion.id_estudiante == id_estudiante)).all()

def update_calificacion_complete_service(session: Session, id_calificacion: int, data: CalificacionPut) -> Calificacion:
    calificacion = session.get(Calificacion, id_calificacion)
    if not calificacion:
        raise HTTPException(status_code=404, detail="Calificación no encontrada.")

    _validar_foraneas(session, data.id_estudiante, data.id_asignatura)
    _validar_duplicidad_calificacion(session, data.id_estudiante, data.id_asignatura, data.lapso_periodo, exclude_id=id_calificacion)

    update_dict = data.model_dump()
    for key, value in update_dict.items():
        setattr(calificacion, key, value)

    session.add(calificacion)
    session.commit()
    session.refresh(calificacion)
    return calificacion

def update_calificacion_partial_service(session: Session, id_calificacion: int, data: CalificacionUpdate) -> Calificacion:
    calificacion = session.get(Calificacion, id_calificacion)
    if not calificacion:
        raise HTTPException(status_code=404, detail="Calificación no encontrada.")

    update_dict = data.model_dump(exclude_unset=True)

    id_est = update_dict.get("id_estudiante", calificacion.id_estudiante)
    id_asig = update_dict.get("id_asignatura", calificacion.id_asignatura)
    lapso = update_dict.get("lapso_periodo", calificacion.lapso_periodo)

    if "id_estudiante" in update_dict or "id_asignatura" in update_dict:
        _validar_foraneas(session, id_est, id_asig)

    if "id_estudiante" in update_dict or "id_asignatura" in update_dict or "lapso_periodo" in update_dict:
        _validar_duplicidad_calificacion(session, id_est, id_asig, lapso, exclude_id=id_calificacion)

    for key, value in update_dict.items():
        setattr(calificacion, key, value)

    session.add(calificacion)
    session.commit()
    session.refresh(calificacion)
    return calificacion

def delete_calificacion_service(session: Session, id_calificacion: int):
    calificacion = session.get(Calificacion, id_calificacion)
    if not calificacion or not calificacion.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Calificación no encontrada o ya inactiva"
        )
    
    calificacion.is_active = False
    
    session.add(calificacion)
    session.commit()
    return {"message": "Calificación inactivada exitosamente"}