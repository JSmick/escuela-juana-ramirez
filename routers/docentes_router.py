from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from models.models import  Docente
from schemas.docente_schema import  DocenteCreate, EstadoLaboral, Docentes, DocenteUpdate, DocenteRead, DocentesRead
from database.connection import get_session
from typing import Optional, List

router = APIRouter(
    prefix="/docente",
    tags=["Docente"]
) 

@router.post("", response_model=DocenteRead)
def create_docente(docente_data: DocenteCreate, session: Session = Depends(get_session)):
    new_docente = Docente(
        nom=docente_data.nom,
        apell=docente_data.apell,
        cedula=docente_data.cedula,
        telef=docente_data.telef,
        email=docente_data.email,
        fec_ingre=docente_data.fec_ingre,
        estado_laboral=docente_data.estado_laboral
    )
    session.add(new_docente)
    session.commit()
    session.refresh(new_docente)
    return new_docente

@router.get("/cedula/{cedula}", response_model=DocenteRead)
def get_docente(cedula: str, session: Session = Depends(get_session)):
    docente = session.exec(select(Docente).where(Docente.cedula == cedula, Docente.estado_laboral == "activo")).first()
    if not docente:
        raise HTTPException(status_code=404, detail="Docente no encontrado")
    return docente


@router.get("/estado/{estado}", response_model=list[DocenteRead])
def get_docentes_por_estado(estado: EstadoLaboral, session: Session = Depends(get_session)):
    docentes = session.exec(select(Docente).where(Docente.estado_laboral == estado)).all()
    return docentes


@router.patch("/{cedula}", response_model=DocentesRead)
def update_docente(cedula: str, docente_data: DocenteUpdate, session: Session = Depends(get_session)
):
    docente = session.exec(select(Docente).where(Docente.cedula == cedula, Docente.estado_laboral == "activo")).first()
    
    if not docente:
        raise HTTPException(status_code=404, detail="Docente no encontrado")
    
    update_dict = docente_data.model_dump(exclude_unset=True)
    
    for k, v in update_dict.items():
        setattr(docente, k, v)
        
    session.add(docente) 
    session.commit()
    session.refresh(docente)
    
    return docente


@router.put("/{cedula}", response_model=DocentesRead)
def update_docente(cedula: str, docente_data: Docentes, session: Session = Depends(get_session)):
    docente = session.exec(select(Docente).where(Docente.cedula == cedula, Docente.estado_laboral == "activo")).first()

    if not docente:
        raise HTTPException(status_code=404, detail="Docente no encontrado") 

    update = docente_data.model_dump()
    for k, v in update.items():
        setattr(docente, k, v)
    session.commit()
    session.refresh(docente)
    return docente

@router.delete("/{cedula}")
def delete_docente(cedula: str, session: Session = Depends(get_session)):
    docente = session.exec(select(Docente).where(Docente.cedula == cedula, Docente.estado_laboral == "activo")).first()
    
    if not docente:
        raise HTTPException(status_code=404, detail="Docente no encontrado")
    
    docente.estado_laboral = "inactivo"
    
    session.add(docente)
    session.commit()
    session.refresh(docente)
    
    return {"message": "Docente inactivado exitosamente"}