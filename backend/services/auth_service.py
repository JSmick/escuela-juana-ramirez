from datetime import datetime, timedelta
from fastapi import HTTPException, status
from sqlmodel import Session, select
from passlib.context import CryptContext    
from jose import JWTError, jwt
import os

from models.usuario_model import Usuario
from schemas.usuario_schema import UsuarioCreate, UsuarioLogin, RepresentanteCreate

# Configuración de Seguridad (Encriptación y JWT)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY", "llave_secreta_super_segura_juana_ramirez_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def encriptar_password(password: str) -> str:
    """Convierte la contraseña plana en un hash seguro."""
    return pwd_context.hash(password)

def verificar_password(password_plana: str, password_hash: str) -> bool:
    """Compara la contraseña ingresada con el hash guardado."""
    return pwd_context.verify(password_plana, password_hash)

def crear_token_jwt(data: dict) -> str:
    """Genera el token de acceso JWT con tiempo de expiración."""
    datos_a_cifrar = data.copy()
    expiracion = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    datos_a_cifrar.update({"exp": expiracion})
    return jwt.encode(datos_a_cifrar, SECRET_KEY, algorithm=ALGORITHM)


# --- SERVICIOS DE AUTENTICACIÓN ---

def registrar_nuevo_usuario(datos_usuario: UsuarioCreate, session: Session) -> Usuario:
    """Servicio para registrar un usuario en la base de datos."""
    statement = select(Usuario).where(Usuario.correo_user == datos_usuario.correo_user)
    usuario_existente = session.exec(statement).first()
    
    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo electrónico ya se encuentra registrado."
        )
    
    password_cifrada = encriptar_password(datos_usuario.pass_user)
    
    nuevo_usuario = Usuario(
        correo_user=datos_usuario.correo_user,
        pass_user=password_cifrada,
        id_rol=datos_usuario.id_rol
    )
    
    session.add(nuevo_usuario)
    session.commit()
    session.refresh(nuevo_usuario)
    
    return nuevo_usuario


def registrar_representante(datos_usuario: RepresentanteCreate, session: Session) -> Usuario:
    """Servicio para registrar exclusivamente a un usuario con rol 3 (Representante)."""
    statement = select(Usuario).where(Usuario.correo_user == datos_usuario.correo_user)
    usuario_existente = session.exec(statement).first()
    
    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo electrónico ya se encuentra registrado."
        )
    
    password_cifrada = encriptar_password(datos_usuario.pass_user)
    
    nuevo_usuario = Usuario(
        correo_user=datos_usuario.correo_user,
        pass_user=password_cifrada,
        id_rol=3  # <-- Forzamos estrictamente el rol 3 aquí
    )
    
    session.add(nuevo_usuario)
    session.commit()
    session.refresh(nuevo_usuario)
    
    return nuevo_usuario


def autenticar_usuario(datos_login: UsuarioLogin, session: Session) -> str:
    """Servicio para iniciar sesión y obtener el token JWT."""
    statement = select(Usuario).where(Usuario.correo_user == datos_login.correo_user)
    usuario = session.exec(statement).first()
    
    if not usuario or not verificar_password(datos_login.pass_user, usuario.pass_user):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo electrónico o contraseña incorrectos.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Payload que lleva el ID del usuario ("sub") y su rol de forma automática
    payload_token = {
        "sub": str(usuario.id_user),
        "correo": usuario.correo_user,
        "role": usuario.id_rol
    }
    
    token = crear_token_jwt(payload_token)
    return token