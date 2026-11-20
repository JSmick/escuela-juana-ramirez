from sqlmodel import Session, select
from fastapi import HTTPException, status
from typing import Optional
from models.asistencia_model import Asistencia
from models.estudiante_model import Estudiante
from models.seccion_model import Seccion
from models.asignatura_model import Asignatura
from models.inscripcion_model import Inscripcion

from schemas.asistencia_schema import AsistenciaCreate, AsistenciaPut, AsistenciaUpdate

def _validar_foraneas(session: Session, id_estudiante: int, id_seccion: int, id_asignatura: Optional[int] = None):
    """Función auxiliar para verificar que existan las entidades relacionadas."""
    if not session.get(Estudiante, id_estudiante):
        raise HTTPException(status_code=404, detail="El estudiante especificado no existe.")
    if not session.get(Seccion, id_seccion):
        raise HTTPException(status_code=404, detail="La sección especificada no existe.")
    if id_asignatura is not None:
        if not session.get(Asignatura, id_asignatura):
            raise HTTPException(status_code=404, detail="La asignatura especificada no existe.")
        
def verificar_estudiante_inscrito(session: Session, id_estudiante: int, id_seccion: int) -> bool:
    # ¿existe una inscripción activa para ese estudiante en la sección?
    statement = select(Inscripcion).where(
        Inscripcion.id_estudiante == id_estudiante, 
        Inscripcion.id_seccion == id_seccion,
        Inscripcion.is_active == True
    )
    inscripcion = session.exec(statement).first()
    
    #  True si lo encontró (sí está inscrito) o False si no
    return inscripcion is not None    

def create_asistencia_service(session: Session, asistencia_data: AsistenciaCreate):
    # si esta inscrito en esa seccion true
    esta_inscrito = verificar_estudiante_inscrito(
        session=session, 
        id_estudiante=asistencia_data.id_estudiante, 
        id_seccion=asistencia_data.id_seccion
    )
    
    #es False error 400
    if not esta_inscrito:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El estudiante no está inscrito en esta sección, por lo tanto no se le puede registrar asistencia."
        )
    
  
    nueva_asistencia = Asistencia(**asistencia_data.model_dump()) 
    session.add(nueva_asistencia)
    session.commit()
    session.refresh(nueva_asistencia)
    return nueva_asistencia



def get_asistencias_service(session: Session, skip: int = 0, limit: int = 100) -> list[Asistencia]:
    return session.exec(select(Asistencia).offset(skip).limit(limit)).all()

def get_asistencia_by_id_service(session: Session, id_asistencia: int) -> Asistencia:
    asistencia = session.get(Asistencia, id_asistencia)
    if not asistencia:
        raise HTTPException(status_code=404, detail="Registro de asistencia no encontrado.")
    return asistencia

def get_asistencias_por_estudiante_service(session: Session, id_estudiante: int) -> list[Asistencia]:
    return session.exec(select(Asistencia).where(Asistencia.id_estudiante == id_estudiante)).all()

def get_asistencias_por_seccion_service(session: Session, id_seccion: int) -> list[Asistencia]:
    return session.exec(select(Asistencia).where(Asistencia.id_seccion == id_seccion)).all()

def update_asistencia_complete_service(session: Session, id_asistencia: int, data: AsistenciaPut) -> Asistencia:
    asistencia = session.get(Asistencia, id_asistencia)
    if not asistencia:
        raise HTTPException(status_code=404, detail="Registro de asistencia no encontrado.")

    _validar_foraneas(session, data.id_estudiante, data.id_seccion, data.id_asignatura)

    update_dict = data.model_dump()
    for key, value in update_dict.items():
        setattr(asistencia, key, value)

    session.add(asistencia)
    session.commit()
    session.refresh(asistencia)
    return asistencia

def update_asistencia_partial_service(session: Session, id_asistencia: int, data: AsistenciaUpdate) -> Asistencia:
    asistencia = session.get(Asistencia, id_asistencia)
    if not asistencia:
        raise HTTPException(status_code=404, detail="Registro de asistencia no encontrado.")

    update_dict = data.model_dump(exclude_unset=True)

    _validar_foraneas(
        session,
        update_dict.get("id_estudiante", asistencia.id_estudiante),
        update_dict.get("id_seccion", asistencia.id_seccion),
        update_dict.get("id_asignatura", asistencia.id_asignatura)
    )

    for key, value in update_dict.items():
        setattr(asistencia, key, value)

    session.add(asistencia)
    session.commit()
    session.refresh(asistencia)
    return asistencia

def delete_asistencia_service(session: Session, id_asistencia: int):
    asistencia = session.get(Asistencia, id_asistencia)
    if not asistencia:
        raise HTTPException(status_code=404, detail="Registro de asistencia no encontrado.")

    session.delete(asistencia)
    session.commit() 
    return {"message": "Registro de asistencia eliminado exitosamente"}

# def delete_asistencia_service(session: Session, id_asistencia: int):
#     asistencia = session.get(Asistencia, id_asistencia)
#     if not asistencia or not asistencia.is_active:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND, 
#             detail="Registro de asistencia no encontrado o ya inactivo"
#         )
    
#     asistencia.is_active = False
#     asistencia.updated_at = date.today()  # O datetime.now() según tu modelo
    
#     session.add(asistencia)
#     session.commit()
#     return {"message": "Registro de asistencia inactivado exitosamente"}