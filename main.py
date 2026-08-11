from fastapi import FastAPI, HTTPException, Depends
from sqlmodel import SQLModel
from database.connection import engine
from routers.docentes_router import router as docente_router
from routers.representant_router import router as representante_router
from routers.student_router import router as student_router
from routers.a_s_g_t_as_router import router as a_s_g_t_as_router

import models

app = FastAPI()

app.include_router(docente_router, tags=["Docentes"], prefix="/Docentes")
app.include_router(representante_router, tags=["Representantes"], prefix="/Representantes")
app.include_router(student_router, tags=["Estudiantes"], prefix="/Estudiantes")
app.include_router(a_s_g_t_as_router, tags=["Gestión de Clases"], prefix="/Gestión")

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)