from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from models.models import Estudiante
from schemas.estudiante_schema import EstudianteCreate, EstudianteUpdate, EstadoAcademico, EstudianteRead, Estudiantes
from database.connection import get_session
from typing import Optional, List

router = APIRouter()

@router.post("", response_model=EstudianteRead)
def create_estudiante(estudiante_data: EstudianteCreate, session: Session = Depends(get_session)):
    new_estudiante = Estudiante(
        nom=estudiante_data.nom,
        apell=estudiante_data.apell,
        fecha_nac=estudiante_data.fecha_nac,
        id_repre=estudiante_data.id_repre,
        estado_academico=estudiante_data.estado_academico
    )
    session.add(new_estudiante)
    session.commit()
    session.refresh(new_estudiante)
    return new_estudiante

@router.get("/estado/{estado_academico}", response_model=list[EstudianteRead])
def get_estudiantes_por_estado(estado_academico: EstadoAcademico, session: Session = Depends(get_session)):
    estudiantes = session.exec(select(Estudiante).where(Estudiante.estado_academico == estado_academico)).all()
    return estudiantes

@router.get("/representante/{repre_id}", response_model=list[EstudianteRead])
def get_estudiantes_por_representante(repre_id: int, session: Session = Depends(get_session)):
    
    statement = select(Estudiante).where(Estudiante.id_repre == repre_id )
    
    results = session.exec(statement).all()

    if not results:
        raise HTTPException(
            status_code=404, 
            detail=f"No se encontraron estudiantes para el representante con ID {repre_id}"
        )
    return results

@router.patch("/{studs_id}", response_model=EstudianteRead)
def update_estudiante(studs_id: int, estudiante_data: EstudianteUpdate, session: Session = Depends(get_session)):
    estudiante = session.exec(select(Estudiante).where(Estudiante.id_studs == studs_id, Estudiante.estado_academico == "activo")).first()

    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    
    update_dict = estudiante_data.model_dump(exclude_unset=True)
    
    for k, v in update_dict.items():
        setattr(estudiante, k, v)
        
    session.add(estudiante) 
    session.commit()
    session.refresh(estudiante)
    
    return estudiante

@router.put("/{studs_id}", response_model=EstudianteRead)
def update_estudiante(studs_id: int, estudiante_data: EstudianteUpdate, session: Session = Depends(get_session)):
    estudiante = session.exec(select(Estudiante).where(Estudiante.id_studs == studs_id, Estudiante.estado_academico == "activo")).first()

    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    update = estudiante_data.model_dump()
    for k, v in update.items():
        setattr(estudiante, k, v)
    session.commit()
    session.refresh(estudiante)
    return estudiante

@router.delete("/{studs_id}")
def delete_estudiante(studs_id: int, session: Session = Depends(get_session)):
    estudiante = session.exec(select(Estudiante).where(Estudiante.id_studs == studs_id, Estudiante.estado_academico == "activo")).first()
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    estudiante.estado_academico = "inactivo"

    session.commit()
    session.refresh(estudiante)

    return {"message": "Estudiante desactivado exitosamente", "estudiante": estudiante}

