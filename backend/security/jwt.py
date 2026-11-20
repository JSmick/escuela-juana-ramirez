from jose import jwt
import os

SECRET_KEY = os.getenv("SECRET_KEY", "llave_secreta_super_segura_juana_ramirez_2026")
ALGORITHM = "HS256"

def decode_access_token(token: str) -> dict:
    """Decodifica y valida el token JWT usando la clave secreta."""
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])