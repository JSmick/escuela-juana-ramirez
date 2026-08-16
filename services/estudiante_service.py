from datetime import date
from fastapi import HTTPException
from sqlmodel import Session, select

from models.estudiante_model import Estudiante
from models.representante_model import Representante
from schemas.estudiante_schema import (EstudianteCreate, EstudiantePut, EstudianteUpdate)

def _validar_representante(id_repre: int | None, session: Session):
    if id_repre is not None:
        repre = session.get(Representante, id_repre)
        if not repre or not repre.is_active:
            raise HTTPException(status_code=404, detail="El representante especificado no existe o está inactivo")

def create_estudiante(estudiante_data: EstudianteCreate, session: Session):
    _validar_representante(estudiante_data.id_repre, session)

    existing_activo = session.exec(
        select(Estudiante).where(Estudiante.nom == estudiante_data.nom, Estudiante.apell == estudiante_data.apell, Estudiante.fecha_nac == estudiante_data.fecha_nac, Estudiante.is_active == True)).first()

    if existing_activo:
        raise HTTPException(status_code=400, detail="Ya existe un estudiante activo con ese nombre, apellido y fecha de nacimiento")

    nuevo = Estudiante.model_validate(estudiante_data)
    session.add(nuevo)
    session.commit()
    session.refresh(nuevo)
    return nuevo

def reactivar_estudiante(id_studs: int, session: Session):
    estudiante = session.get(Estudiante, id_studs)
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    if estudiante.is_active:
        raise HTTPException(status_code=400, detail="El estudiante ya se encuentra activo")

    estudiante.is_active = True
    estudiante.updated_at = date.today()

    session.add(estudiante)
    session.commit()
    session.refresh(estudiante)
    return estudiante

def get_estudiantes(session: Session, skip: int = 0, limit: int = 100):
    return session.exec(select(Estudiante).where(Estudiante.is_active == True).offset(skip).limit(limit)).all()

def get_estudiante(id_studs: int, session: Session):
    estudiante = session.get(Estudiante, id_studs)
    if not estudiante or not estudiante.is_active:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado o inactivo")
    return estudiante

def update_estudiante_complete(id_studs: int, estudiante_data: EstudiantePut, session: Session):
    estudiante = session.get(Estudiante, id_studs)
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    _validar_representante(estudiante_data.id_repre, session)

    existing = session.exec(select(Estudiante).where(Estudiante.nom == estudiante_data.nom, Estudiante.apell == estudiante_data.apell, Estudiante.fecha_nac == estudiante_data.fecha_nac, Estudiante.is_active == True, Estudiante.id_studs != id_studs,)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe otro estudiante activo con ese nombre, apellido y fecha de nacimiento",)

    update_dict = estudiante_data.model_dump()
    for key, value in update_dict.items():
        setattr(estudiante, key, value)

    estudiante.updated_at = date.today()

    session.add(estudiante)
    session.commit()
    session.refresh(estudiante)
    return estudiante

def update_estudiante_partial(id_studs: int, estudiante_data: EstudianteUpdate, session: Session):
    estudiante = session.get(Estudiante, id_studs)
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    update_dict = estudiante_data.model_dump(exclude_unset=True)

    if "id_repre" in update_dict:
        _validar_representante(update_dict["id_repre"], session)

    check_nom = update_dict.get("nom", estudiante.nom)
    check_apell = update_dict.get("apell", estudiante.apell)
    check_fecha_nac = update_dict.get("fecha_nac", estudiante.fecha_nac)

    if any(k in update_dict for k in ("nom", "apell", "fecha_nac")):
        existing = session.exec(select(Estudiante).where(Estudiante.nom == check_nom, Estudiante.apell == check_apell, Estudiante.fecha_nac == check_fecha_nac, Estudiante.is_active == True, Estudiante.id_studs != id_studs)).first()
        if existing:
            raise HTTPException(status_code=400, detail="Ya existe otro estudiante activo con ese nombre, apellido y fecha de nacimiento",)

    for key, value in update_dict.items():
        setattr(estudiante, key, value)

    estudiante.updated_at = date.today()

    session.add(estudiante)
    session.commit()
    session.refresh(estudiante)
    return estudiante


def delete_estudiante(id_studs: int, session: Session):
    estudiante = session.get(Estudiante, id_studs)
    if not estudiante or not estudiante.is_active:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado o ya inactivo")

    estudiante.is_active = False
    estudiante.updated_at = date.today()

    session.add(estudiante)
    session.commit()
    return {"message": "Estudiante inactivado exitosamente"}