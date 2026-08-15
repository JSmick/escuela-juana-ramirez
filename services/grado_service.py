from fastapi import HTTPException
from sqlmodel import Session, select

from models.grado_model import Grado
from schemas.grado_schema import GradoCreate, GradoPut, GradoUpdate


def create_grado(grado_data: GradoCreate, session: Session):
    existing_grado = session.exec(select(Grado).where(Grado.descripcion == grado_data.descripcion)).first()
    if existing_grado:
        if existing_grado.is_active:
            raise HTTPException(status_code=400, detail="El grado ya se encuentra registrado")

        existing_grado.is_active = True
        session.add(existing_grado)
        session.commit()
        session.refresh(existing_grado)
        return existing_grado

    new_grado = Grado.model_validate(grado_data)
    session.add(new_grado)
    session.commit()
    session.refresh(new_grado)
    return new_grado

def get_grados(session: Session, skip: int = 0, limit: int = 100):
    return session.exec(select(Grado).where(Grado.is_active == True).offset(skip).limit(limit)).all()

def get_grado(id_grad: int, session: Session):
    grado = session.get(Grado, id_grad)
    if not grado or not grado.is_active:
        raise HTTPException(status_code=404, detail="Grado no encontrado o inactivo")
    return grado

def update_grado_complete(id_grad: int, grado_data: GradoPut, session: Session):
    grado = session.get(Grado, id_grad)
    if not grado:
        raise HTTPException(status_code=404, detail="Grado no encontrado")

    existing = session.exec(select(Grado).where(Grado.descripcion == grado_data.descripcion, Grado.id_grad != id_grad)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe un grado con esa descripción")

    update_dict = grado_data.model_dump()
    for key, value in update_dict.items():
        setattr(grado, key, value)

    session.add(grado)
    session.commit()
    session.refresh(grado)
    return grado

def update_grado_partial(id_grad: int, grado_data: GradoUpdate, session: Session):
    grado = session.get(Grado, id_grad)
    if not grado:
        raise HTTPException(status_code=404, detail="Grado no encontrado")

    update_dict = grado_data.model_dump(exclude_unset=True)
    if "descripcion" in update_dict:
        existing = session.exec(select(Grado).where(Grado.descripcion == update_dict["descripcion"], Grado.id_grad != id_grad)).first()
        if existing:raise HTTPException(status_code=400, detail="Ya existe un grado con esa descripción")

    for key, value in update_dict.items():
        setattr(grado, key, value)

    session.add(grado)
    session.commit()
    session.refresh(grado)
    return grado

def delete_grado(id_grad: int, session: Session):
    grado = session.get(Grado, id_grad)
    if not grado or not grado.is_active:
        raise HTTPException(status_code=404, detail="Grado no encontrado o ya inactivo")

    grado.is_active = False
    session.add(grado)
    session.commit()
    return {"message": "Grado inactivado exitosamente"}