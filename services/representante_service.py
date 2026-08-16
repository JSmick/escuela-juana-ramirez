from datetime import date
from fastapi import HTTPException
from sqlmodel import Session, select, or_

from models.representante_model import Representante
from schemas.representante_schema import (RepresentanteCreate, RepresentantePut, RepresentanteUpdate)

def create_representante(representante_data: RepresentanteCreate, session: Session):
    existing_cedula = session.exec(select(Representante).where(Representante.cedula == representante_data.cedula)).first()
    if existing_cedula:
        if existing_cedula.is_active:
            raise HTTPException(status_code=400, detail="La cédula ya se encuentra registrada en el sistema",)

        if representante_data.email:
            existing_email = session.exec(select(Representante).where(Representante.email == representante_data.email, Representante.id_represen != existing_cedula.id_represen)).first()
            if existing_email:
                raise HTTPException(status_code=400, detail="El correo electrónico ya está en uso por otro representante",)

        update_dict = representante_data.model_dump()
        for key, value in update_dict.items():
            setattr(existing_cedula, key, value)

        existing_cedula.is_active = True
        existing_cedula.updated_at = date.today()

        session.add(existing_cedula)
        session.commit()
        session.refresh(existing_cedula)
        return existing_cedula

    if representante_data.email:
        existing_email = session.exec(select(Representante).where(Representante.email == representante_data.email)).first()
        if existing_email:
            raise HTTPException(status_code=400,detail="El correo electrónico ya está en uso por otro representante")

    new_representante = Representante.model_validate(representante_data)
    session.add(new_representante)
    session.commit()
    session.refresh(new_representante)
    return new_representante

def get_representantes(session: Session, skip: int = 0, limit: int = 100):
    return session.exec(select(Representante).where(Representante.is_active == True).offset(skip).limit(limit)).all()

def get_representante(id_represen: int, session: Session):
    representante = session.get(Representante, id_represen)
    if not representante or not representante.is_active:
        raise HTTPException(status_code=404, detail="Representante no encontrado o inactivo")
    return representante

def update_representante_complete(
    id_represen: int, representante_data: RepresentantePut, session: Session):
    representante = session.get(Representante, id_represen)
    if not representante:
        raise HTTPException(status_code=404, detail="Representante no encontrado")

    conditions = [Representante.cedula == representante_data.cedula]
    if representante_data.email:
        conditions.append(Representante.email == representante_data.email)

    existing = session.exec(select(Representante).where(or_(*conditions), Representante.id_represen != id_represen)).first()
    if existing:
        raise HTTPException(status_code=400, detail="La cédula o correo electrónico ya están en uso por otro representante",)

    update_dict = representante_data.model_dump()
    for key, value in update_dict.items():
        setattr(representante, key, value)

    representante.updated_at = date.today()

    session.add(representante)
    session.commit()
    session.refresh(representante)
    return representante

def update_representante_partial(id_represen: int, representante_data: RepresentanteUpdate, session: Session):
    representante = session.get(Representante, id_represen)
    if not representante:
        raise HTTPException(status_code=404, detail="Representante no encontrado")

    update_dict = representante_data.model_dump(exclude_unset=True)

    check_conditions = []
    if "cedula" in update_dict:
        check_conditions.append(Representante.cedula == update_dict["cedula"])
    if "email" in update_dict and update_dict["email"] is not None:
        check_conditions.append(Representante.email == update_dict["email"])

    if check_conditions:
        existing = session.exec(select(Representante).where(or_(*check_conditions), Representante.id_represen != id_represen)).first()
        if existing:
            raise HTTPException(status_code=400, detail="La cédula o correo electrónico ya están en uso por otro representante")

    for key, value in update_dict.items():
        setattr(representante, key, value)

    representante.updated_at = date.today()

    session.add(representante)
    session.commit()
    session.refresh(representante)
    return representante

def delete_representante(id_represen: int, session: Session):
    representante = session.get(Representante, id_represen)
    if not representante or not representante.is_active:
        raise HTTPException(status_code=404, detail="Representante no encontrado o ya inactivo")

    representante.is_active = False
    representante.updated_at = date.today()

    session.add(representante)
    session.commit()
    return {"message": "Representante inactivado exitosamente"}