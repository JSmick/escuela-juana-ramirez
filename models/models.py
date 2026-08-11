from sqlalchemy import Column, Date, Integer, String, Enum as SQLEnum
from sqlmodel import SQLModel, Field, Relationship
from datetime import date, time
from typing import Optional, List
from schemas.docente_schema import EstadoLaboral

class Docente(SQLModel, table=True):
    id_docen: int = Field(default=None, primary_key=True)
    nom: str
    apell: str
    cedula: str
    telef: str 
    email: str 
    fec_ingre: date = Field(default_factory=date.today)
    estado_laboral: str = Field(default="activo")
    #seccion: List["Seccion"] = Relationship(back_populates="docente")

class Representantes(SQLModel, table=True):
    id_represen: int = Field(default=None, primary_key=True)
    nom: str
    apell: str
    cedula: str
    telef: str
    direccion: str
    estatus: str = Field(default="activo")  
    estudiante: List["Estudiante"] = Relationship(back_populates="representantes")  
    
class Estudiante(SQLModel, table=True):
    id_studs: int = Field(default=None, primary_key=True)
    nom: str
    apell: str
    fecha_nac: date
    id_repre: int = Field(default=None, foreign_key="representantes.id_represen")
    representantes: Optional[Representantes] = Relationship(back_populates="estudiante")
    estado_academico: str = Field(default="activo")

class asignatura(SQLModel, table=True):
    id_asign: int = Field(default=None, primary_key=True)
    descripcion: str    

class Turno(SQLModel, table=True):
    id_turno: int = Field(default=None, primary_key=True)
    descripcion: str

class Grado(SQLModel, table=True):
    id_grad: int = Field(default=None, primary_key=True)
    descripcion: str 

class Aulas(SQLModel, table=True):
    id_aula: int = Field(default=None, primary_key=True)
    descripcion: str

class Seccion(SQLModel, table=True):
    id_seccion: int = Field(default=None, primary_key=True)
    descripcion: str 
    id_turno: int = Field(default=None, foreign_key="turno.id_turno")   
    id_grado: int = Field(default=None, foreign_key="grado.id_grad")
    id_docent: int = Field(default=None, foreign_key="docente.id_docen")
    #docente: "Docente" = Relationship(back_populates="seccion")


class Horario(SQLModel, table=True):
    id_horario: int = Field(default=None, primary_key=True)
    id_docent: int = Field(default=None, foreign_key="docente.id_docen")
    id_aula: int = Field(default=None, foreign_key="aulas.id_aula")
    hora_inicio: time
    hora_fin: time  
    dia: str  
    id_seccion: int = Field(default=None, foreign_key="seccion.id_seccion")
    id_asig: int = Field(default=None, foreign_key="asignatura.id_asign")