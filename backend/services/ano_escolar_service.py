from sqlmodel import Session, select
from fastapi import HTTPException
from models.anoEscolar_model import AnoEscolar
from schemas.anoEscolar_schema import AnoEscolarCreate, AnoEscolarPut, AnoEscolarUpdate

def create_ano_escolar_service(session: Session, data: AnoEscolarCreate) -> AnoEscolar:
    # Verificar si  existe un año escolar con el mismo nombre
    existing = session.exec(select(AnoEscolar).where(AnoEscolar.nombre == data.nombre)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe un año escolar registrado con ese nombre.")

    db_ano = AnoEscolar(**data.model_dump())
    session.add(db_ano)
    session.commit()
    session.refresh(db_ano)
    return db_ano

def get_anos_escolares_service(session: Session, skip: int = 0, limit: int = 100) -> list[AnoEscolar]:
    return session.exec(select(AnoEscolar).where(AnoEscolar.is_active == True).offset(skip).limit(limit)).all()

def get_ano_escolar_by_id_service(session: Session, id_ano: int) -> AnoEscolar:
    ano = session.get(AnoEscolar, id_ano)
    if not ano or not ano.is_active:
        raise HTTPException(status_code=404, detail="Año escolar no encontrado o inactivo.")
    return ano

def update_ano_escolar_complete_service(session: Session, id_ano: int, data: AnoEscolarPut) -> AnoEscolar:
    ano = session.get(AnoEscolar, id_ano)
    if not ano:
        raise HTTPException(status_code=404, detail="Año escolar no encontrado.")

    update_dict = data.model_dump()
    for key, value in update_dict.items():
        setattr(ano, key, value)

    session.add(ano)
    session.commit()
    session.refresh(ano)
    return ano

def update_ano_escolar_partial_service(session: Session, id_ano: int, data: AnoEscolarUpdate) -> AnoEscolar:
    ano = session.get(AnoEscolar, id_ano)
    if not ano:
        raise HTTPException(status_code=404, detail="Año escolar no encontrado.")

    update_dict = data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(ano, key, value)

    session.add(ano)
    session.commit()
    session.refresh(ano)
    return ano

def delete_ano_escolar_service(session: Session, id_ano: int):
    ano = session.get(AnoEscolar, id_ano)
    if not ano or not ano.is_active:
        raise HTTPException(status_code=404, detail="Año escolar no encontrado o ya inactivo.")

    ano.is_active = False
    session.add(ano)
    session.commit()
    return {"message": "Año escolar inactivado exitosamente"}