from fastapi import HTTPException
from sqlmodel import Session, select

from models.asignatura_model import Asignatura
from schemas.asignatura_schema import (AsignaturaCreate, AsignaturaPut,AsignaturaUpdate)

def create_asignatura(asignatura_data: AsignaturaCreate, session: Session):
    existing_asignatura = session.exec(select(Asignatura).where(Asignatura.descripcion == asignatura_data.descripcion)).first()
    if existing_asignatura:
        if existing_asignatura.is_active:
            raise HTTPException(status_code=400,detail="La asignatura ya se encuentra registrada",)

        existing_asignatura.is_active = True
        session.add(existing_asignatura)
        session.commit()
        session.refresh(existing_asignatura)
        return existing_asignatura

    new_asignatura = Asignatura.model_validate(asignatura_data)
    session.add(new_asignatura)
    session.commit()
    session.refresh(new_asignatura)
    return new_asignatura

def get_asignaturas(session: Session, skip: int = 0, limit: int = 100):
    return session.exec(select(Asignatura).where(Asignatura.is_active == True).offset(skip).limit(limit)).all()

def get_asignatura(id_asign: int, session: Session):
    asignatura = session.get(Asignatura, id_asign)
    if not asignatura or not asignatura.is_active:
        raise HTTPException(status_code=404, detail="Asignatura no encontrada o inactiva")
    return asignatura

def update_asignatura_complete(id_asign: int, asignatura_data: AsignaturaPut, session: Session):
    asignatura = session.get(Asignatura, id_asign)
    if not asignatura:
        raise HTTPException(status_code=404, detail="Asignatura no encontrada")

    existing = session.exec(select(Asignatura).where(Asignatura.descripcion == asignatura_data.descripcion, Asignatura.id_asign != id_asign)).first()
    if existing:
        raise HTTPException(status_code=400,detail="Ya existe una asignatura con esa descripción",)

    update_dict = asignatura_data.model_dump()
    for key, value in update_dict.items():
        setattr(asignatura, key, value)

    session.add(asignatura)
    session.commit()
    session.refresh(asignatura)
    return asignatura

def update_asignatura_partial(id_asign: int, asignatura_data: AsignaturaUpdate, session: Session):
    asignatura = session.get(Asignatura, id_asign)
    if not asignatura:
        raise HTTPException(status_code=404, detail="Asignatura no encontrada")

    update_dict = asignatura_data.model_dump(exclude_unset=True)
    if "descripcion" in update_dict:
        existing = session.exec(select(Asignatura).where(Asignatura.descripcion == update_dict["descripcion"], Asignatura.id_asign != id_asign,)).first()
        if existing:
            raise HTTPException(status_code=400,detail="Ya existe una asignatura con esa descripción",)

    for key, value in update_dict.items():
        setattr(asignatura, key, value)

    session.add(asignatura)
    session.commit()
    session.refresh(asignatura)
    return asignatura

def delete_asignatura(id_asign: int, session: Session):
    asignatura = session.get(Asignatura, id_asign)
    if not asignatura or not asignatura.is_active:
        raise HTTPException(status_code=404, detail="Asignatura no encontrada o ya inactiva")

    asignatura.is_active = False
    session.add(asignatura)
    session.commit()
    return {"message": "Asignatura inactivada exitosamente"}