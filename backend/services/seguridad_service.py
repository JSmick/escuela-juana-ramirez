from sqlmodel import Session, select
from fastapi import HTTPException, status
from models.seguridad_model import Pregunta, PreguntaSeg
from models.usuario_model import Usuario  # Importamos el modelo usuario para buscar por correo
from schemas.seguridad_schema import PreguntaSegCreate, ValidarRespuesta, ResetPasswordConPregunta
from schemas.seguridad_schema import PreguntaSegEmailCreate

from services.auth_service import encriptar_password  # Asegúrate de importar tu función para hashear contraseñas

def get_preguntas_activas_service(session: Session):
    statement = select(Pregunta).where(Pregunta.is_active == True)
    return session.exec(statement).all()

def registrar_pregunta_usuario_service(session: Session, data: PreguntaSegCreate, user_id: int):
    """
    Asocia la pregunta de seguridad usando el id_user extraído del token de sesión.
    """
    pregunta_db = session.get(Pregunta, data.id_pre)
    if not pregunta_db or not pregunta_db.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="La pregunta de seguridad seleccionada no es válida o no está activa."
        )

    db_pregunta_seg = PreguntaSeg(
        id_user=user_id,  # <--- Inyectado automáticamente de manera segura
        id_pre=data.id_pre,
        respuesta_pre=data.respuesta_pre
    )
    
    session.add(db_pregunta_seg)
    session.commit()
    session.refresh(db_pregunta_seg)
    return db_pregunta_seg

def validar_respuesta_usuario_service(session: Session, data: ValidarRespuesta):
    """
    Valida la respuesta buscando primero al usuario mediante su correo electrónico.
    """
    # 1. Buscamos el usuario por su correo
    usuario = session.exec(select(Usuario).where(Usuario.correo_user == data.correo)).first()
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontró un usuario registrado con ese correo."
        )

    # 2. Buscamos la pregunta de seguridad vinculada a ese usuario encontrado
    statement = select(PreguntaSeg).where(
        PreguntaSeg.id_user == usuario.id_user,
        PreguntaSeg.id_pre == data.id_pre
    )
    pregunta_seg_db = session.exec(statement).first()
    
    if not pregunta_seg_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontró un registro de pregunta de seguridad para este usuario."
        )
    
    # 3. Validamos la respuesta
    if pregunta_seg_db.respuesta_pre != data.respuesta_pre:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La respuesta proporcionada es incorrecta."
        )
        
    return {"mensaje": "Respuesta validada exitosamente", "valido": True}

def reset_password_con_pregunta_service(session: Session, data: ResetPasswordConPregunta):
    """
    Valida la respuesta de seguridad del usuario por su correo y, si es correcta, 
    actualiza su contraseña por una nueva.
    """
    # 1. Buscamos el usuario por su correo
    usuario = session.exec(select(Usuario).where(Usuario.correo_user == data.correo)).first()
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontró un usuario registrado con ese correo."
        )

    # 2. Verificamos que la pregunta y la respuesta coincidan con las de ese usuario
    statement = select(PreguntaSeg).where(
        PreguntaSeg.id_user == usuario.id_user,
        PreguntaSeg.id_pre == data.id_pre
    )
    pregunta_seg_db = session.exec(statement).first()
    
    if not pregunta_seg_db or pregunta_seg_db.respuesta_pre != data.respuesta_pre:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La respuesta a la pregunta de seguridad es incorrecta."
        )
    
    # 3. Si todo es correcto, actualizamos la contraseña del usuario
    usuario.pass_user = encriptar_password(data.nueva_password)
    
    session.add(usuario)
    session.commit()
    session.refresh(usuario)
    
    return {"mensaje": "Contraseña restablecida exitosamente. Ya puedes iniciar sesión.", "exito": True}

def registrar_pregunta_usuario_por_email_service(session: Session, data: PreguntaSegEmailCreate):
    # 1. Buscar al usuario en la base de datos usando el correo
    usuario = session.query(Usuario).filter(Usuario.correo_user == data.correo_user).first()
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No existe un usuario registrado con este correo."
        )

    # 2. Validar que la pregunta esté activa
    pregunta_db = session.get(Pregunta, data.id_pre)
    if not pregunta_db or not pregunta_db.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="La pregunta seleccionada no es válida o no está activa."
        )

    # 3. Usar el ID real encontrado de manera segura a partir del correo
    db_pregunta_seg = PreguntaSeg(
        id_user=usuario.id_user,  # <--- ID obtenido desde la BD de forma segura
        id_pre=data.id_pre,
        respuesta_pre=data.respuesta_pre
    )

    session.add(db_pregunta_seg)
    session.commit()
    session.refresh(db_pregunta_seg)
    return db_pregunta_seg