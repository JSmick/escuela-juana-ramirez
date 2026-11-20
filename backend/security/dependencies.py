from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from security.jwt import decode_access_token

security = HTTPBearer(
    scheme_name="BearerAuth"
)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Extrae y valida el usuario actual a partir del token Bearer."""
    token = credentials.credentials
    
    try:
        payload = decode_access_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    subject = payload.get("sub")
    role = payload.get("role")
    
    if not subject or role is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o incompleto",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return {
        "sub": subject,
        "role": role
    }

def require_roles(*allowed_roles: int):
    """Dependencia flexible para restringir el acceso a ciertos roles."""
    def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos suficientes para realizar esta acción"
            )
        return current_user
    return role_checker