from enum import Enum

class EstadoLaboral(str, Enum):
    ACTIVO = "activo"
    INACTIVO = "inactivo"
    REPOSO = "reposo"
    PERMISO = "permiso"

class DiaSemana(str, Enum):
    LUNES = "Lunes"
    MARTES = "Martes"
    MIERCOLES = "Miércoles"
    JUEVES = "Jueves"
    VIERNES = "Viernes"
    SABADO = "Sábado"

class CalificacionLetra(str, Enum):
    A = "A"
    B = "B"
    C = "C"
    D = "D"
    E = "E"

class EstadoAsistencia(str, Enum):
    PRESENTE = "Presente"
    AUSENTE = "Ausente"
    JUSTIFICADO = "Justificado"
    RETRASO = "Retraso"

class NivelGrado(str, Enum):
    PRIMERO = "1er Grado"
    SEGUNDO = "2do Grado"
    TERCERO = "3er Grado"
    CUARTO = "4to Grado"
    QUINTO = "5to Grado"
    SEXTO = "6to Grado"