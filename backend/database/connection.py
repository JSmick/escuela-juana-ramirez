""" from sqlmodel import Session, create_engine

DATABASE_URL = "postgresql+psycopg://postgres:3690@localhost:5432/escuela"
engine = create_engine(DATABASE_URL)

def get_session():
    with Session(engine) as session:
        yield session

 """
import os
from dotenv import load_dotenv
from sqlmodel import Session, create_engine

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL no está configurada en el archivo .env")

engine = create_engine(DATABASE_URL)

def get_session():
    with Session(engine) as session:
        yield session