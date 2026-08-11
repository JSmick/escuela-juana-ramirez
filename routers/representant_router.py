from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from models.models import  Representantes
from schemas.representant_schema import  RepresentantesCreate, RepresentanteRead, RepresentanteUpdate, Representante, Estatus, RepresentantesRead
from database.connection import get_session
from typing import Optional, List

router = APIRouter() 

@router.post("", response_model=RepresentanteRead)
def create_representante(representante_data: RepresentantesCreate, session: Session = Depends(get_session)):
    new_representante = Representantes(
        nom=representante_data.nom,
        apell=representante_data.apell,
        cedula=representante_data.cedula,
        telef=representante_data.telef,
        direccion=representante_data.direccion,
        estatus=representante_data.estatus
    )
    session.add(new_representante)
    session.commit()
    session.refresh(new_representante)
    return new_representante

@router.get("/cedula/{cedula}", response_model=RepresentanteRead)
def get_representante(cedula: str, session: Session = Depends(get_session)):
    representante = session.exec(select(Representantes).where(Representantes.cedula == cedula, Representantes.estatus == "activo")).first()
    if not representante:
        raise HTTPException(status_code=404, detail="Representante no encontrado")
    return representante

@router.get("/estado/{estado}", response_model=list[RepresentanteRead])
def get_representantes_por_estado(estado: Estatus, session: Session = Depends(get_session)):
    representantes = session.exec(select(Representantes).where(Representantes.estatus == estado)).all()
    return representantes

@router.patch("/{cedula}", response_model=RepresentantesRead)
def update_representante(cedula: str, representante_data: RepresentanteUpdate, session: Session = Depends(get_session)
):
    representante = session.exec(select(Representantes).where(Representantes.cedula == cedula, Representantes.estatus == "activo")).first()
    
    if not representante:
        raise HTTPException(status_code=404, detail="Representante no encontrado")
    
    update_dict = representante_data.model_dump(exclude_unset=True)
    
    for k, v in update_dict.items():
        setattr(representante, k, v)
        
    session.add(representante) 
    session.commit()
    session.refresh(representante)
    
    return representante


@router.put("/{cedula}", response_model=RepresentantesRead)
def update_representante(cedula: str, representante_data: Representante, session: Session = Depends(get_session)):
    representante = session.exec(select(Representantes).where(Representantes.cedula == cedula, Representantes.estatus == "activo")).first()

    if not representante:
        raise HTTPException(status_code=404, detail="Representante no encontrado") 

    update = representante_data.model_dump()
    for k, v in update.items():
        setattr(representante, k, v)
    session.commit()
    session.refresh(representante)
    return representante


@router.delete("/{cedula}")
def delete_representante(cedula: str, session: Session = Depends(get_session)):
    representante = session.exec(select(Representantes).where(Representantes.cedula == cedula, Representantes.estatus == "activo")).first()
    
    if not representante:
        raise HTTPException(status_code=404, detail="Representante no encontrado")
    
    representante.estatus = "inactivo"
    
    session.add(representante)
    session.commit()
    session.refresh(representante)
    
    return {"message": "Representante inactivado exitosamente"}