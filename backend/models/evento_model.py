from sqlmodel import SQLModel, Field, Relationship
from datetime import date, time
from typing import Optional, TYPE_CHECKING
from core.enums import DetallesEvento

if TYPE_CHECKING:
    from models.grado_model import Grado

class Evento(SQLModel, table=True):
    __tablename__ = "eventos"

    id_evento: Optional[int] = Field(default=None, primary_key=True)
    titulo_evento: str = Field(max_length=100, description="Título del evento")
    tipo_evento: DetallesEvento = Field(description="Tipo de evento")
    detalles_even: str = Field(max_length=100, description="Detalles o descripción del evento")
    fecha_even: date = Field(description="Fecha del evento")
    hora_inicio: time = Field(description="Hora/ de inicio del evento")
    hora_fin: time = Field(description="Hora/ de culminación del evento")
    id_grado: int = Field(foreign_key="grados.id_grad", index=True)
    lugar_even: str = Field(max_length=100, description="Lugar donde se realizará el evento")

    is_active: bool = Field(default=True, index=True)

    #  grado asociado x evento 
    grado: Optional["Grado"] = Relationship(back_populates="eventos")