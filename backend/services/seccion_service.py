from sqlmodel import Session, select
from fastapi import HTTPException
from models.seccion_model import Seccion
from models.turno_model import Turno
from models.grado_model import Grado
from models.docente_model import Docente
from models.anoEscolar_model import AnoEscolar
from schemas.seccion_schema import SeccionCreate, SeccionPut, SeccionUpdate

def _validar_foraneas(session: Session, id_turno: int, id_grado: int, id_ano_escolar: int, id_docent: int | None):
    """Función auxiliar para verificar que existan las entidades relacionadas."""
    if not session.get(Turno, id_turno):
        raise HTTPException(status_code=404, detail="El turno especificado no existe.")
    if not session.get(Grado, id_grado):
        raise HTTPException(status_code=404, detail="El grado especificado no existe.")
    if not session.get(AnoEscolar, id_ano_escolar):
        raise HTTPException(status_code=404, detail="El año escolar especificado no existe.")
    if id_docent is not None:
        if not session.get(Docente, id_docent):
            raise HTTPException(status_code=404, detail="El docente guía especificado no existe.")

def create_seccion_service(session: Session, data: SeccionCreate) -> Seccion:
    _validar_foraneas(session, data.id_turno, data.id_grado, data.id_ano_escolar, data.id_docent)

    db_seccion = Seccion(**data.model_dump())
    session.add(db_seccion)
    session.commit()
    session.refresh(db_seccion)
    return db_seccion

def get_secciones_service(session: Session, skip: int = 0, limit: int = 100) -> list[Seccion]:
    return session.exec(select(Seccion).where(Seccion.is_active == True).offset(skip).limit(limit)).all()

def get_seccion_by_id_service(session: Session, id_seccion: int) -> Seccion:
    seccion = session.get(Seccion, id_seccion)
    if not seccion or not seccion.is_active:
        raise HTTPException(status_code=404, detail="Sección no encontrada o inactiva.")
    return seccion

def update_seccion_complete_service(session: Session, id_seccion: int, data: SeccionPut) -> Seccion:
    seccion = session.get(Seccion, id_seccion)
    if not seccion:
        raise HTTPException(status_code=404, detail="Sección no encontrada.")

    _validar_foraneas(session, data.id_turno, data.id_grado, data.id_ano_escolar, data.id_docent)

    update_dict = data.model_dump()
    for key, value in update_dict.items():
        setattr(seccion, key, value)

    session.add(seccion)
    session.commit()
    session.refresh(seccion)
    return seccion

def update_seccion_partial_service(session: Session, id_seccion: int, data: SeccionUpdate) -> Seccion:
    seccion = session.get(Seccion, id_seccion)
    if not seccion:
        raise HTTPException(status_code=404, detail="Sección no encontrada.")

    update_dict = data.model_dump(exclude_unset=True)

    _validar_foraneas(
        session,
        update_dict.get("id_turno", seccion.id_turno),
        update_dict.get("id_grado", seccion.id_grado),
        update_dict.get("id_ano_escolar", seccion.id_ano_escolar),
        update_dict.get("id_docent", seccion.id_docent)
    )

    for key, value in update_dict.items():
        setattr(seccion, key, value)

    session.add(seccion)
    session.commit()
    session.refresh(seccion)
    return seccion

def delete_seccion_service(session: Session, id_seccion: int):
    seccion = session.get(Seccion, id_seccion)
    if not seccion or not seccion.is_active:
        raise HTTPException(status_code=404, detail="Sección no encontrada o ya inactiva.")

    seccion.is_active = False
    session.add(seccion)
    session.commit()
    return {"message": "Sección inactivada exitosamente"}