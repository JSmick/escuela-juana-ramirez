from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from models.models import  Grado, asignatura, Turno, Aulas, Seccion
from schemas.asig_schema import  AsigCreate, AsigU, AsigUpdate, AsigRead
from schemas.grado_schema import GradoCreate, GradosU, GradoUpdate, GradoRead
from schemas.turno_schema import TurnoCreate, TurnosU, TurnoUpdate, TurnoRead
from schemas.aula_schema import AulasCreate, AulasU, AulasUpdate, AulasRead
from schemas.seccion_schema import SeccionCreate, SeccionesU, SeccionUpdate, SeccionRead, secciones
from schemas.docente_schema import DocenteCreate, DocenteUpdate, DocenteRead
from database.connection import get_session
from typing import Optional, List

router = APIRouter()


@router.post("/asignatura", response_model=asignatura)
def create_asignatura(asignatura_data: AsigCreate, session: Session = Depends(get_session)):
    new_asignatura = asignatura(
        descripcion=asignatura_data.descripcion
    )
    session.add(new_asignatura)
    session.commit()
    session.refresh(new_asignatura)
    return new_asignatura

@router.post("/turnos", response_model=TurnoRead)
def create_turno(turno_data: TurnoCreate, session: Session = Depends(get_session)):
    new_turno = Turno(
        descripcion=turno_data.descripcion
    )
    session.add(new_turno)
    session.commit()
    session.refresh(new_turno)
    return new_turno

@router.post("/grados", response_model=GradoRead)
def create_grado(grado_data: GradoCreate, session: Session = Depends(get_session)):
    new_grado = Grado(
        descripcion=grado_data.descripcion
    )
    session.add(new_grado)
    session.commit()
    session.refresh(new_grado)
    return new_grado

@router.post("/aula", response_model=AulasRead)
def create_aula(aula_data: AulasCreate, session: Session = Depends(get_session)):
    new_aula = Aulas(
        descripcion=aula_data.descripcion
    )
    session.add(new_aula)
    session.commit()
    session.refresh(new_aula)
    return new_aula


@router.post("/secciones", response_model=SeccionRead)
def create_seccion(seccion_data: SeccionCreate, session: Session = Depends(get_session)):
    new_seccion = Seccion(
        descripcion=seccion_data.descripcion,
        id_grado=seccion_data.id_grado,
        id_turno=seccion_data.id_turno,
        id_docent=seccion_data.id_docent
    )
    session.add(new_seccion)
    session.commit()
    session.refresh(new_seccion)
    return new_seccion


@router.get("/asignaturas", response_model=list[AsigRead])
def get_asignaturas_general(session: Session = Depends(get_session)):
    asignaturas = session.exec(select(asignatura)).all()
    return asignaturas

@router.get("/aulas", response_model=list[AulasRead])
def get_aulas_general(session: Session = Depends(get_session)):
    aulas = session.exec(select(Aulas)).all()
    return aulas    


@router.patch("/seccion/{seccion_id}", response_model=SeccionRead)
def update_seccion(seccion_id: int, seccion_data: SeccionUpdate, session: Session = Depends(get_session)):
    seccion = session.exec(select(Seccion).where(Seccion.id_seccion == seccion_id)).first()

    if not seccion:
        raise HTTPException(status_code=404, detail="Sección no encontrada")
    
    update_dict = seccion_data.model_dump(exclude_unset=True)
    
    for k, v in update_dict.items():
        setattr(seccion, k, v)
        
    session.add(seccion) 
    session.commit()
    session.refresh(seccion)
    
    return seccion