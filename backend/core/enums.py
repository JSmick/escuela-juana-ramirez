from enum import Enum

class EstadoLaboral(str, Enum):#
    ACTIVO = "activo"
    INACTIVO = "inactivo"
    REPOSO = "reposo"
    PERMISO = "permiso"

class DiaSemana(str, Enum):#
    LUNES = "Lunes"
    MARTES = "Martes"
    MIERCOLES = "Miércoles"
    JUEVES = "Jueves"
    VIERNES = "Viernes"
    SABADO = "Sábado"

class CalificacionLetra(str, Enum):#
    A = "A"
    B = "B"
    C = "C"
    D = "D"
    E = "E"

class EstadoAsistencia(str, Enum):#
    PRESENTE = "Presente"
    AUSENTE = "Ausente"
    JUSTIFICADO = "Justificado"
    RETRASO = "Retraso"

class NivelGrado(str, Enum):#
    INICIAL_A = "Inicial A"
    INICIAL_B = "Inicial B"
    PRIMERO = "1er Grado"
    SEGUNDO = "2do Grado"
    TERCERO = "3er Grado"
    CUARTO = "4to Grado"
    QUINTO = "5to Grado"
    SEXTO = "6to Grado"

class RolEnum(str, Enum):#
    ADMINISTRADOR = "Administrador"
    DOCENTE = "Docente"
    REPRESENTANTE = "Representante"

class lapsoEscolar(str, Enum):
  PRIMERO_LAPSO = "1er Lapso"
  SEGUNDO_LAPSO = "2do Lapso"
  TERCERO_LAPSO = "3er Lapso"

class Genero(str, Enum):
    MASCULINO = "Masculino"
    FEMENINO = "Femenino"

class EstadoProyecto(str, Enum):
    EN_EJECUCION = "En Ejecución"
    COMPLETADO = "Completado"
    PLANIFICADO = "Planificado"

class ParentescoLegal(str, Enum):
    PADRE = "Padre"
    MADRE = "Madre"
    REPRESENTANTE_LEGAL = "Representante Legal"
    OTRO = "Otro"

class EstadoFisico(str, Enum):
    BUENO = "Bueno"
    REGULAR = "Regular"
    MALO = "Malo"

class DetallesEvento(str, Enum):
    EFEMERIDES = "Efemérides"
    FERIA_EXPO = "Feria Expo"
    CULTURAL = "Cultural"
    REUNION = "Reunión"
    OTRO = "Otro"