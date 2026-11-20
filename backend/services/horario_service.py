from sqlmodel import Session, select, or_, and_

from datetime import time, datetime # Asegúrate de importar time si no está
from typing import Optional
from fastapi import HTTPException
from models.horario_model import Horario
from models.docente_model import Docente
from models.aula_model import Aula
from models.seccion_model import Seccion
from models.asignatura_model import Asignatura
from schemas.horario_schema import HorarioCreate, HorarioPut, HorarioUpdate

def _validar_foraneas(session: Session, id_docent: int, id_aula: int, id_seccion: int, id_asig: int):
    """Función auxiliar para verificar que existan las entidades relacionadas."""
    if not session.get(Docente, id_docent):
        raise HTTPException(status_code=404, detail="El docente especificado no existe.")
    if not session.get(Aula, id_aula):
        raise HTTPException(status_code=404, detail="El aula especificada no existe.")
    if not session.get(Seccion, id_seccion):
        raise HTTPException(status_code=404, detail="La sección especificada no existe.")
    if not session.get(Asignatura, id_asig):
        raise HTTPException(status_code=404, detail="La asignatura especificada no existe.")

def _validar_conflicto_horario(
    session: Session, 
    dia: str, 
    hora_inicio: time, 
    hora_fin: time, 
    id_aula: int, 
    id_docent: int, 
    id_seccion: int, 
    exclude_id: Optional[int] = None
):
    """Verifica cruces de horario para el aula, el docente y la sección en el mismo día."""
    
    # 1. Validar sentido lógico de las horas
    if hora_inicio >= hora_fin:
        raise HTTPException(
            status_code=400,
            detail="La hora de inicio debe ser anterior a la hora de fin."
        )

    # Condición base de solapamiento de horas en un día específico y activo
    cruce_horas = and_(
        Horario.is_active == True,
        Horario.dia == dia,
        Horario.hora_inicio < hora_fin,
        Horario.hora_fin > hora_inicio
    )

    # Consultas para cada recurso
    query_aula = select(Horario).where(cruce_horas, Horario.id_aula == id_aula)
    query_docente = select(Horario).where(cruce_horas, Horario.id_docent == id_docent)
    query_seccion = select(Horario).where(cruce_horas, Horario.id_seccion == id_seccion)

    if exclude_id is not None:
        query_aula = query_aula.where(Horario.id_horario != exclude_id)
        query_docente = query_docente.where(Horario.id_horario != exclude_id)
        query_seccion = query_seccion.where(Horario.id_horario != exclude_id)

    # Validar Aula
    if session.exec(query_aula).first():
        raise HTTPException(
            status_code=400,
            detail="El aula seleccionada ya se encuentra ocupada por otra clase en este mismo día y horario."
        )

    # Validar Docente
    if session.exec(query_docente).first():
        raise HTTPException(
            status_code=400,
            detail="El docente asignado ya tiene otra clase impartiéndose en este mismo día y horario."
        )

    # Validar Sección
    if session.exec(query_seccion).first():
        raise HTTPException(
            status_code=400,
            detail="La sección seleccionada ya tiene otra asignatura programada en este mismo día y horario."
        )
        

def create_horario_service(session: Session, data: HorarioCreate) -> Horario:
    _validar_foraneas(session, data.id_docent, data.id_aula, data.id_seccion, data.id_asig)
    _validar_conflicto_horario(session, data.dia, data.hora_inicio, data.hora_fin, data.id_aula, data.id_docent, data.id_seccion)

    db_horario = Horario(**data.model_dump())
    session.add(db_horario)
    session.commit()
    session.refresh(db_horario)
    return db_horario

def get_horarios_service(session: Session, skip: int = 0, limit: int = 100) -> list[Horario]:
    return session.exec(select(Horario).where(Horario.is_active == True).offset(skip).limit(limit)).all()

def get_horario_by_id_service(session: Session, id_horario: int) -> Horario:
    horario = session.get(Horario, id_horario)
    if not horario or not horario.is_active:
        raise HTTPException(status_code=404, detail="Horario no encontrado o inactivo.")
    return horario

def get_horarios_por_docente_service(session: Session, id_docent: int) -> list[Horario]:
    return session.exec(select(Horario).where(Horario.id_docent == id_docent, Horario.is_active == True)).all()

def update_horario_complete_service(session: Session, id_horario: int, data: HorarioPut) -> Horario:
    horario = session.get(Horario, id_horario)
    if not horario:
        raise HTTPException(status_code=404, detail="Horario no encontrado.")

    _validar_foraneas(session, data.id_docent, data.id_aula, data.id_seccion, data.id_asig)

    update_dict = data.model_dump()
    for key, value in update_dict.items():
        setattr(horario, key, value)

    session.add(horario)
    session.commit()
    session.refresh(horario)
    return horario

def update_horario_partial_service(session: Session, id_horario: int, data: HorarioUpdate) -> Horario:
    horario = session.get(Horario, id_horario)
    if not horario:
        raise HTTPException(status_code=404, detail="Horario no encontrado.")

    update_dict = data.model_dump(exclude_unset=True)

    # Validar foráneas solo si vienen en el patch
    _validar_foraneas(
        session,
        update_dict.get("id_docent", horario.id_docent),
        update_dict.get("id_aula", horario.id_aula),
        update_dict.get("id_seccion", horario.id_seccion),
        update_dict.get("id_asig", horario.id_asig)
    )

    for key, value in update_dict.items():
        setattr(horario, key, value)

    session.add(horario)
    session.commit()
    session.refresh(horario)
    return horario

def delete_horario_service(session: Session, id_horario: int):
    horario = session.get(Horario, id_horario)
    if not horario or not horario.is_active:
        raise HTTPException(status_code=404, detail="Horario no encontrado o ya inactivo.")

    horario.is_active = False
    session.add(horario)
    session.commit()
    return {"message": "Horario inactivado exitosamente"}