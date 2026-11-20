from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from database.connection import get_session
from schemas.usuario_schema import UsuarioCreate, UsuarioLogin, UsuarioResponse, TokenResponse
from services.auth_service import registrar_nuevo_usuario, autenticar_usuario, registrar_representante
from schemas.usuario_schema import RepresentanteCreate # Importa el nuevo esquema


router = APIRouter(
    prefix="/auth",
    tags=["Autenticación y Usuarios"]
)

@router.post("/register", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def registrar_usuario(datos_usuario: UsuarioCreate, session: Session = Depends(get_session)):
    """Endpoint para registrar un nuevo usuario en el sistema escolar."""
    nuevo_usuario = registrar_nuevo_usuario(datos_usuario, session)
    return nuevo_usuario


@router.post("/login", response_model=TokenResponse)
def iniciar_sesion(datos_login: UsuarioLogin, session: Session = Depends(get_session)):
    """Endpoint para iniciar sesión. Devuelve un token JWT de acceso."""
    token = autenticar_usuario(datos_login, session)
    return {"access_token": token, "token_type": "bearer"}


@router.post("/register/representante", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def registrar_representante_endpoint(datos_usuario: RepresentanteCreate, session: Session = Depends(get_session)):
    """Endpoint exclusivo para registrar un nuevo usuario con rol de Representante (Rol 3)."""
    return registrar_representante(datos_usuario, session)