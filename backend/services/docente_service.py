from sqlmodel import Session, select
from models.docente_model import Docente  # O la ruta donde tengas tu modelo de base de datos
from schemas.docente_schema import DocenteCreate, DocenteUpdate, DocenteBase, EstadoLaboral
from fastapi import HTTPException
from models.usuario_model import Usuario
from services.auth_service import encriptar_password

def create_docente_service(session: Session, docente_data: DocenteCreate) -> Docente:
    # 1. Validar si el email ya existe como usuario
    if docente_data.email:
        usuario_existente = session.exec(
            select(Usuario).where(Usuario.correo_user == docente_data.email)
        ).first()
        if usuario_existente:
            raise HTTPException(status_code=400, detail="Ya existe un usuario registrado con ese correo.")

        # 2. Crear automáticamente el Usuario asociado al Docente (Rol de docente, ej: rol 2)
        nuevo_usuario = Usuario(
            correo_user=docente_data.email,
            pass_user=encriptar_password(docente_data.password_temporal),
            id_rol=2  # Asumiendo que el rol 2 es Docente
        )
        session.add(nuevo_usuario)
        session.flush() # Genera el id_user sin hacer commit final todavía

        user_id = nuevo_usuario.id_user
    else:
        raise HTTPException(status_code=400, detail="El correo electrónico es obligatorio para crear el usuario docente.")

    # 3. Crear el Docente inyectando automáticamente el id_user recién creado
    db_docente = Docente(
        nom=docente_data.nom,
        apell=docente_data.apell,
        cedula=docente_data.cedula,
        telef=docente_data.telef,
        email=docente_data.email,
        fec_ingre=docente_data.fec_ingre,
        estado_laboral=docente_data.estado_laboral,
        id_user=user_id,  # <--- INYECTADO DE FORMA AUTOMÁTICA
        direccion=docente_data.direccion,
        titulo_academico=docente_data.titulo_academico
    )
    
    session.add(db_docente)
    session.commit()
    session.refresh(db_docente)
    return db_docente

def get_docente_by_cedula_service(session: Session, cedula: str) -> Docente | None:
    return session.exec(
        select(Docente).where(Docente.cedula == cedula, Docente.estado_laboral == EstadoLaboral.ACTIVO)
    ).first()

def get_docentes_por_estado_service(session: Session, estado: EstadoLaboral) -> list[Docente]:
    return session.exec(select(Docente).where(Docente.estado_laboral == estado)).all()

def update_docente_partial_service(session: Session, cedula: str, docente_data: DocenteUpdate) -> Docente | None:
    docente = get_docente_by_cedula_service(session, cedula)
    if not docente:
        return None
    
    update_dict = docente_data.model_dump(exclude_unset=True)
    for k, v in update_dict.items():
        setattr(docente, k, v)
        
    session.add(docente) 
    session.commit()
    session.refresh(docente)
    return docente

def update_docente_full_service(session: Session, cedula: str, docente_data: DocenteBase) -> Docente | None:
    docente = get_docente_by_cedula_service(session, cedula)
    if not docente:
        return None 

    update_dict = docente_data.model_dump()
    for k, v in update_dict.items():
        setattr(docente, k, v)
        
    session.add(docente)
    session.commit()
    session.refresh(docente)
    return docente

def delete_docente_service(session: Session, cedula: str) -> Docente | None:
    docente = get_docente_by_cedula_service(session, cedula)
    if not docente:
        return None
    
    # Aquí corregimos el bug: modificamos la instancia encontrada, no la clase Base
    docente.estado_laboral = EstadoLaboral.INACTIVO 
    
    
    session.add(docente)
    session.commit()
    session.refresh(docente)
    return docente