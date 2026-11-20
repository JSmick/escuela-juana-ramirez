from sqlmodel import Session, select
from fastapi import HTTPException, status
from models.proyecto_model import Proyecto
from models.docente_model import Docente  # Asegúrate de importar tu modelo Docente
from schemas.proyecto_schema import ProyectoCreate, ProyectoUpdate

# Función auxiliar interna para validar docentes
def _validar_docente(id_docente: int, session: Session):
    docente = session.get(Docente, id_docente)
    if not docente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"El docente con ID {id_docente} no existe."
        )
     #Si tu tabla de docentes tiene algún campo de estado (ej. is_active), puedes validarlo aquí también:   #if not docente.is_active:
        #raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El docente está inactivo.")
    # Validamos que el docente esté activo
    if not docente.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="El docente está inactivo."
    )
        
    return docente    

def crear_proyecto(session: Session, proyecto_data: ProyectoCreate):
    # Validamos que el docente exista antes de guardar el proyecto
    _validar_docente(proyecto_data.id_docente, session)

    nuevo_proyecto = Proyecto(**proyecto_data.model_dump())
    session.add(nuevo_proyecto)
    session.commit()
    session.refresh(nuevo_proyecto)
    return nuevo_proyecto

def actualizar_proyecto(session: Session, id_proyecto: int, proyecto_data: ProyectoUpdate):
    proyecto = session.get(Proyecto, id_proyecto)
    if not proyecto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proyecto no encontrado")
    
    update_dict = proyecto_data.model_dump(exclude_unset=True)

    # Si van a actualizar el id_docente, validamos que el nuevo docente exista
    if "id_docente" in update_dict:
        _validar_docente(update_dict["id_docente"], session)

    for key, value in update_dict.items():
        setattr(proyecto, key, value)
        
    session.add(proyecto)
    session.commit()
    session.refresh(proyecto)
    return proyecto

def update_proyecto_complete(id_proyecto: int, proyecto_data: ProyectoUpdate, session: Session):
    proyecto = session.get(Proyecto, id_proyecto)
    if not proyecto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proyecto no encontrado")
    
    update_dict = proyecto_data.model_dump(exclude_unset=True)

    # Validamos que el docente exista antes de actualizar el proyecto
    if "id_docente" in update_dict:
        _validar_docente(update_dict["id_docente"], session)

    for key, value in update_dict.items():
        setattr(proyecto, key, value)
        
    session.add(proyecto)
    session.commit()
    session.refresh(proyecto)
    return proyecto

# Función para listar docentes (ideal para poblar un select en el frontend)
def obtener_lista_docentes(session: Session, skip: int = 0, limit: int = 100):
    return session.exec(select(Docente).offset(skip).limit(limit)).all()

def obtener_proyectos(session: Session, skip: int = 0, limit: int = 100):
    return session.exec(select(Proyecto).offset(skip).limit(limit)).all()

def obtener_proyecto_por_id(session: Session, id_proyecto: int):
    proyecto = session.get(Proyecto, id_proyecto)
    if not proyecto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proyecto no encontrado")
    return proyecto

def delete_proyecto(session: Session, id_proyecto: int):
    proyecto = session.get(Proyecto, id_proyecto)
    if not proyecto or not proyecto.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Proyecto no encontrado o ya inactivo"
        )
    
    proyecto.is_active = False
    
    session.add(proyecto)
    session.commit()
    return {"message": "Proyecto inactivado exitosamente"}