from sqlmodel import Session, create_engine

DATABASE_URL = "postgresql+psycopg://postgres:3690@localhost:5432/escuela"
engine = create_engine(DATABASE_URL)

def get_session():
    with Session(engine) as session:
        yield session