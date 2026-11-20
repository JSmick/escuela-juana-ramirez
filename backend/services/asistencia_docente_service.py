from sqlmodel import Session, select
from datetime import date
from fastapi import HTTPException
from models.asistenciaDocente_model import AsistenciaDocente
from models.docente_model import Docente
from schemas.asistenciaDocente_schema import AsistenciaDocenteRead, AsistenciaDocenteCreate, AsistenciaDocenteBase, AsistenciaDocenteSalida, AsistenciaDocenteUpdate, ReporteCumplimientoDocente

def create_asistencia_docente_service(session: Session, data: AsistenciaDocenteCreate) -> AsistenciaDocente:
    #  que el docente exista
    docente = session.get(Docente, data.id_docen)
    if not docente:
        raise HTTPException(status_code=404, detail="El docente especificado no existe.")

    db_asistencia = AsistenciaDocente(**data.model_dump())
    session.add(db_asistencia)
    session.commit()
    session.refresh(db_asistencia)
    return db_asistencia

def get_asistencias_docentes_service(session: Session, skip: int = 0, limit: int = 100) -> list[AsistenciaDocente]:
    return session.exec(select(AsistenciaDocente).offset(skip).limit(limit)).all()

def get_asistencia_docente_by_id_service(session: Session, id_asistencia: int) -> AsistenciaDocente:
    asistencia = session.get(AsistenciaDocente, id_asistencia)
    if not asistencia:
        raise HTTPException(status_code=404, detail="Registro de asistencia no encontrado.")
    return asistencia

def get_asistencias_por_docente_service(session: Session, id_docen: int) -> list[AsistenciaDocente]:
    return session.exec(select(AsistenciaDocente).where(AsistenciaDocente.id_docen == id_docen)).all()

def update_asistencia_docente_service(session: Session, id_asistencia: int, data: AsistenciaDocenteUpdate) -> AsistenciaDocente:
    asistencia = session.get(AsistenciaDocente, id_asistencia)
    if not asistencia:
        raise HTTPException(status_code=404, detail="Registro de asistencia no encontrado.")

    update_dict = data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(asistencia, key, value)

    session.add(asistencia)
    session.commit()
    session.refresh(asistencia)
    return asistencia

def delete_asistencia_docente_service(session: Session, id_asistencia: int):
    asistencia = session.get(AsistenciaDocente, id_asistencia)
    if not asistencia:
        raise HTTPException(status_code=404, detail="Registro de asistencia no encontrado.")

    session.delete(asistencia) 
    session.commit()
    return {"message": "Registro de asistencia eliminado exitosamente"}