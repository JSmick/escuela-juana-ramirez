from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from database.connection import get_session
from security.dependencies import get_current_user  
from schemas.seguridad_schema import (
    PreguntaRead,
    PreguntaSegCreate,
    PreguntaSegRead,
    ValidarRespuesta, 
    ResetPasswordConPregunta,
    PreguntaSegEmailCreate
)

from services import seguridad_service

router = APIRouter(prefix="/seguridad", tags=["Seguridad y Recuperación"])

@router.get("/preguntas", response_model=List[PreguntaRead])
def listar_preguntas_activas(session: Session = Depends(get_session)):
    return seguridad_service.get_preguntas_activas_service(session)

@router.post("/usuario-pregunta", response_model=PreguntaSegRead, status_code=status.HTTP_201_CREATED)
def registrar_pregunta_usuario(
    data: PreguntaSegCreate, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user)  
):
    """
    Asocia una pregunta de seguridad al usuario autenticado de forma automática.
    """
    user_id = int(current_user.get("sub"))  
    return seguridad_service.registrar_pregunta_usuario_service(session, data, user_id)

@router.post("/validar-respuesta")
def validar_respuesta_usuario(
    data: ValidarRespuesta, 
    session: Session = Depends(get_session)
):
    """
    Valida la respuesta de seguridad usando el correo electrónico (Ideal para recuperación).
    """
    return seguridad_service.validar_respuesta_usuario_service(session, data)


@router.post("/recuperar-password")
def recuperar_password_con_pregunta(
    data: ResetPasswordConPregunta, 
    session: Session = Depends(get_session)
):
    """
    Permite restablecer la contraseña de un usuario validando su correo, 
    la pregunta y la respuesta secreta configurada previamente.
    """
    return seguridad_service.reset_password_con_pregunta_service(session, data)

@router.post("/registrar-pregunta")
def registrar_pregunta_endpoint(
    data: PreguntaSegEmailCreate, 
    session: Session = Depends(get_session)
):
    """
    Endpoint para registrar la pregunta de seguridad buscando al usuario por su correo electrónico.
    """
    return seguridad_service.registrar_pregunta_usuario_por_email_service(session, data)    