from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlmodel import SQLModel
from fastapi.middleware.cors import CORSMiddleware

from database.connection import engine

from models.asignatura_model import Asignatura
from models.asistenciaDocente_model import AsistenciaDocente
from models.asistencia_model import Asistencia
from models.anoEscolar_model import AnoEscolar
from models.aula_model import Aula
from models.calificacion_model import Calificacion
from models.docente_model import Docente
from models.estudiante_model import Estudiante
from models.evento_model import Evento
from models.grado_model import Grado
from models.horario_model import Horario
from models.inscripcion_model import Inscripcion
from models.inventario_model import Inventario
from models.proyecto_model import Proyecto
from models.representante_model import Representante
from models.rol_model import Rol
from models.seccion_model import Seccion
from models.seguridad_model import Pregunta, PreguntaSeg
from models.turno_model import Turno
from models.usuario_model import Usuario


from routers import asignatura_router
from routers import asistencia_docente_router
from routers import asistencia_router
from routers import ano_escolar_router
from routers import aula_router
from routers import auth_router
from routers import calificacion_router
from routers import docentes_router
from routers import estudiante_router
from routers import evento_router
from routers import grado_router
from routers import horario_router
from routers import inscripcion_router
from routers import inventario_router
from routers import proyecto_router
from routers import representante_router
from routers import seccion_router
from routers import seguridad_router
from routers import turno_router



@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(title="Sistema de Gestión Escolar API", lifespan=lifespan)

app.include_router(auth_router.router) # router de autenticación
app.include_router(seguridad_router.router)
app.include_router(turno_router.router)
app.include_router(grado_router.router)
app.include_router(aula_router.router)
app.include_router(asignatura_router.router)
app.include_router(docentes_router.router)
app.include_router(representante_router.router)
app.include_router(calificacion_router.router)
app.include_router(estudiante_router.router)
app.include_router(asistencia_docente_router.router)
app.include_router(horario_router.router)
app.include_router(seccion_router.router)
app.include_router(ano_escolar_router.router)
app.include_router(asistencia_router.router)
app.include_router(evento_router.router)
app.include_router(inscripcion_router.router)
app.include_router(inventario_router.router)  
app.include_router(proyecto_router.router)  

@app.get("/")
def read_root():
    return {"message": "Bienvenido"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Permite a React conectarse
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)