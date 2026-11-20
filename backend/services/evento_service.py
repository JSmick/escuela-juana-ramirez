from sqlmodel import Session, select, or_, and_
from datetime import date, time  # <-- Cambia datetime por time
from fastapi import HTTPException, status
from typing import Optional
from models.evento_model import Evento
from models.grado_model import Grado
from schemas.evento_schema import EventoCreate, EventoPut, EventoUpdate

def _validar_grado(session: Session, id_grado: int):
    """Verifica que el grado asignado exista."""
    if not session.get(Grado, id_grado):
        raise HTTPException(status_code=404, detail="El grado especificado no existe.")

def _validar_conflicto_evento(session: Session, fecha: date, lugar: str, hora_inicio: time, hora_fin: time, exclude_id: Optional[int] = None):
    """Verifica si ya existe un evento registrado en el mismo lugar, fecha y horas cruzadas."""
    
    # Condición para solapamiento de horarios en el mismo lugar y fecha
    query = select(Evento).where(
        Evento.fecha_even == fecha,
        Evento.lugar_even == lugar,
        # Detecta si hay cruce de horas (un evento empieza antes de que termine otro y viceversa)
        and_(
            Evento.hora_inicio < hora_fin,
            Evento.hora_fin > hora_inicio
        )
    )
    
    # Si estamos actualizando, excluimos el propio evento que estamos editando
    if exclude_id is not None:
        query = query.where(Evento.id_evento != exclude_id)

    evento_existente = session.exec(query).first()
    if evento_existente:
        raise HTTPException(
            status_code=400, 
            detail=f"Ya existe un evento programado en '{lugar}' para esa fecha en el horario de {evento_existente.hora_inicio.strftime('%H:%M')} a {evento_existente.hora_fin.strftime('%H:%M')}."
        )        

def create_evento_service(session: Session, data: EventoCreate) -> Evento:
    _validar_grado(session, data.id_grado)
    _validar_conflicto_evento(session, data.fecha_even, data.lugar_even, data.hora_inicio, data.hora_fin) # 2. Luego validamos que no choque el horario

    db_evento = Evento(**data.model_dump())
    session.add(db_evento)
    session.commit()
    session.refresh(db_evento)
    return db_evento

def get_eventos_service(session: Session, skip: int = 0, limit: int = 100) -> list[Evento]:
    return session.exec(select(Evento).where(Evento.is_active == True).offset(skip).limit(limit)).all()

def get_evento_by_id_service(session: Session, id_evento: int) -> Evento:
    evento = session.get(Evento, id_evento)
    if not evento:
        raise HTTPException(status_code=404, detail="Evento no encontrado.")
    return evento

def get_eventos_por_grado_service(session: Session, id_grado: int) -> list[Evento]:
    return session.exec(select(Evento).where(Evento.id_grado == id_grado)).all()

def update_evento_complete_service(session: Session, id_evento: int, data: EventoPut) -> Evento:
    evento = session.get(Evento, id_evento)
    if not evento:
        raise HTTPException(status_code=404, detail="Evento no encontrado.")

    _validar_grado(session, data.id_grado)
    _validar_conflicto_evento(session, data.fecha_even, data.lugar_even, data.hora_inicio, data.hora_fin, exclude_id=id_evento)

    update_dict = data.model_dump()
    for key, value in update_dict.items():
        setattr(evento, key, value)

    session.add(evento)
    session.commit()
    session.refresh(evento)
    return evento

def update_evento_partial_service(session: Session, id_evento: int, data: EventoUpdate) -> Evento:
    evento = session.get(Evento, id_evento)
    if not evento:
        raise HTTPException(status_code=404, detail="Evento no encontrado.")

    update_dict = data.model_dump(exclude_unset=True)

    if "id_grado" in update_dict:
        _validar_grado(session, update_dict["id_grado"])

    if "fecha_even" in update_dict or "lugar_even" in update_dict or "hora_inicio" in update_dict or "hora_fin" in update_dict:
        _validar_conflicto_evento(session, update_dict.get("fecha_even", evento.fecha_even), update_dict.get("lugar_even", evento.lugar_even), update_dict.get("hora_inicio", evento.hora_inicio), update_dict.get("hora_fin", evento.hora_fin), exclude_id=id_evento)

    for key, value in update_dict.items():
        setattr(evento, key, value)

    session.add(evento)
    session.commit()
    session.refresh(evento)
    return evento

def delete_evento_service(session: Session, id_evento: int):
    evento = session.get(Evento, id_evento)
    if not evento or not evento.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Evento no encontrado o ya inactivo"
        )
    
    evento.is_active = False

    session.add(evento)
    session.commit()
    return {"message": "Evento inactivado exitosamente"}