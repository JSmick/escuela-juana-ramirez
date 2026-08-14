from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlmodel import SQLModel

from database.connection import engine

from models.anoEscolar_model import AnoEscolar
from models.asignatura_model import Asignatura
from models.asistencia_model import Asistencia
from models.aula_model import Aula
from models.calificacion_model import Calificacion
from models.docente_model import Docente
from models.estudiante_model import Estudiante
from models.grado_model import Grado
from models.horario_model import Horario
from models.inscripcion_model import Inscripcion
from models.representante_model import Representante
from models.seccion_model import Seccion
from models.turno_model import Turno

from routers import turno_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(
    title="Sistema de Gestión Escolar API",
    lifespan=lifespan,
)

app.include_router(turno_router.router)

@app.get("/")
def read_root():
    return {"message": "Bienvenido"}