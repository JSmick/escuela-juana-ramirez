from fastapi import HTTPException
from sqlmodel import Session, select

from models.aula_model import Aula
from schemas.aula_schema import AulaCreate, AulaPut, AulaUpdate

def create_aula(aula_data: AulaCreate, session: Session):
    existing_aula = session.exec(select(Aula).where(Aula.descripcion == aula_data.descripcion)).first()
    if existing_aula:
        if existing_aula.is_active:
            raise HTTPException(status_code=400, detail="El aula ya se encuentra registrada")

        existing_aula.is_active = True
        session.add(existing_aula)
        session.commit()
        session.refresh(existing_aula)
        return existing_aula

    new_aula = Aula.model_validate(aula_data)
    session.add(new_aula)
    session.commit()
    session.refresh(new_aula)
    return new_aula

def get_aulas(session: Session, skip: int = 0, limit: int = 100):
    return session.exec(select(Aula).where(Aula.is_active == True).offset(skip).limit(limit)).all()

def get_aula(id_aula: int, session: Session):
    aula = session.get(Aula, id_aula)
    if not aula or not aula.is_active:
        raise HTTPException(status_code=404, detail="Aula no encontrada o inactiva")
    return aula

def update_aula_complete(id_aula: int, aula_data: AulaPut, session: Session):
    aula = session.get(Aula, id_aula)
    if not aula:
        raise HTTPException(status_code=404, detail="Aula no encontrada")

    existing = session.exec(select(Aula).where(Aula.descripcion == aula_data.descripcion,Aula.id_aula != id_aula,)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe un aula con esa descripción")

    update_dict = aula_data.model_dump()
    for key, value in update_dict.items():
        setattr(aula, key, value)

    session.add(aula)
    session.commit()
    session.refresh(aula)
    return aula

def update_aula_partial(id_aula: int, aula_data: AulaUpdate, session: Session):
    aula = session.get(Aula, id_aula)
    if not aula:
        raise HTTPException(status_code=404, detail="Aula no encontrada")

    update_dict = aula_data.model_dump(exclude_unset=True)
    if "descripcion" in update_dict:
        existing = session.exec(select(Aula).where(Aula.descripcion == update_dict["descripcion"], Aula.id_aula != id_aula)).first()
        if existing:
            raise HTTPException(status_code=400, detail="Ya existe un aula con esa descripción")

    for key, value in update_dict.items():
        setattr(aula, key, value)

    session.add(aula)
    session.commit()
    session.refresh(aula)
    return aula

def delete_aula(id_aula: int, session: Session):
    aula = session.get(Aula, id_aula)
    if not aula or not aula.is_active:
        raise HTTPException(status_code=404, detail="Aula no encontrada o ya inactiva")

    aula.is_active = False
    session.add(aula)
    session.commit()
    return {"message": "Aula inactivada exitosamente"}