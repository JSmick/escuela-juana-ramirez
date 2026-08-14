from fastapi import HTTPException
from sqlmodel import Session, select

from models.turno_model import Turno
from schemas.turno_schema import (TurnoCreate, TurnoPut, TurnoUpdate)

def create_turno(turno_data: TurnoCreate, session: Session):
    existing_turno = session.exec(select(Turno).where(Turno.descripcion == turno_data.descripcion)).first()
    if existing_turno:
        raise HTTPException(status_code=400, detail="El turno ya se encuentra registrado")

    new_turno = Turno.model_validate(turno_data)
    session.add(new_turno)
    session.commit()
    session.refresh(new_turno)
    return new_turno

def get_turnos(skip: int = 0, limit: int = 100, session: Session = None):
    turnos = session.exec(select(Turno).where(Turno.is_active == True).offset(skip).limit(limit)).all()
    return turnos

def get_turno(id_turno: int, session: Session):
    turno = session.get(Turno, id_turno)
    if not turno or not turno.is_active:
        raise HTTPException(status_code=404, detail="Turno no encontrado o inactivo")
    return turno

def update_turno_complete(id_turno: int, turno_data: TurnoPut,session: Session):
    turno = session.get(Turno, id_turno)
    if not turno:
        raise HTTPException(status_code=404, detail="Turno no encontrado")

    update_dict = turno_data.model_dump()
    for key, value in update_dict.items():
        setattr(turno, key, value)

    session.add(turno)
    session.commit()
    session.refresh(turno)
    return turno

def update_turno_partial(id_turno: int, turno_data: TurnoUpdate, session: Session):
    turno = session.get(Turno, id_turno)
    if not turno:
        raise HTTPException(status_code=404, detail="Turno no encontrado")

    update_dict = turno_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(turno, key, value)

    session.add(turno)
    session.commit()
    session.refresh(turno)
    return turno

def delete_turno(id_turno: int, session: Session):
    turno = session.get(Turno, id_turno)
    if not turno or not turno.is_active:
        raise HTTPException(status_code=404, detail="Turno no encontrado o ya inactivo")

    turno.is_active = False
    session.add(turno)
    session.commit()
    return {"message": "Turno inactivado exitosamente"}