import { useState, useEffect } from 'react';
import { getInscripciones } from '../services/inscripcionService';
import { getEstudiantes } from '../services/estudianteService';
import { getSecciones } from '../services/seccionService';
import { getGrados } from '../services/gradoService';

export default function Constancia() {
  const [inscripciones, setInscripciones] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [grados, setGrados] = useState([]);

  const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState(null);

  const [datos, setDatos] = useState({
    gradoCursando: '',
    anioEscolar: '2026 - 2027',
    dia: new Date().getDate(),
    mes: 'Noviembre',
    anio: new Date().getFullYear()
  });

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    try {
      const [inscData, estData, secData, gradData] = await Promise.all([
        getInscripciones(),
        getEstudiantes(),
        getSecciones(),
        getGrados()
      ]);

      setInscripciones(Array.isArray(inscData) ? inscData : inscData.data || []);
      setEstudiantes(Array.isArray(estData) ? estData : estData.data || []);
      setSecciones(Array.isArray(secData) ? secData : secData.data || []);
      setGrados(Array.isArray(gradData) ? gradData : gradData.data || []);
    } catch (error) {
      console.error("Error al cargar datos para la constancia:", error);
      alert("No se pudieron cargar los datos del servidor.");
    }
  };

  // --- FUNCIÓN BLINDADA PARA OBTENER EL NOMBRE ---
  const obtenerNombreEstudiante = (insc) => {
    if (!insc) return '';
    
    if (insc.estudiante) {
      const est = insc.estudiante;
      const nombre = est.nom || est.nombre || '';
      const apellido = est.apell || est.apellido || '';
      if (nombre || apellido) return `${nombre} ${apellido}`.trim();
    }

    const idEst = insc.id_estudiante || insc.id_studs || insc.id_estuc;

    if (!estudiantes || estudiantes.length === 0) {
      return `Cargando...`;
    }

    const est = estudiantes.find(e => {
      const eId = e.id_studs || e.id || e.id_estudiante || e.id_estuc;
      return String(eId) === String(idEst);
    });

    // Si la inscripción apunta a un estudiante que fue borrado de la BD
    if (!est) {
      return `⚠️ Inscripción #${insc.id_inscripcion} (Estudiante #${idEst} no existe)`;
    }

    const nombre = est.nom || est.nombre || '';
    const apellido = est.apell || est.apellido || '';

    return `${nombre} ${apellido}`.trim() || `Estudiante #${idEst}`;
  };
  const obtenerGradoPorSeccion = (idSeccion) => {
    const sec = secciones.find(s => s.id_seccion === idSeccion || s.id === idSeccion);
    if (!sec) return '';
    const grado = grados.find(g => g.id_grad === sec.id_grado || g.id === sec.id_grado);
    return grado ? (grado.descripcion || grado.nombre || '') : '';
  };

  const manejarSeleccionInscripcion = (e) => {
    const idInsc = Number(e.target.value);
    const insc = inscripciones.find(i => i.id_inscripcion === idInsc || i.id === idInsc);
    setInscripcionSeleccionada(insc || null);

    if (insc) {
      const gradoReal = insc.id_seccion ? obtenerGradoPorSeccion(insc.id_seccion) : '';
      setDatos(prev => ({
        ...prev,
        gradoCursando: gradoReal || prev.gradoCursando
      }));
    }
  };

  const manejarCambio = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  return (
    <div style={{ backgroundColor: '#e2e8f0', padding: '40px', minHeight: '100vh' }}>
      
      {/* Controles superiores */}
      <div style={{ maxWidth: '800px', margin: '0 auto 20px auto', display: 'flex', gap: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <div style={{ flex: 1 }}>
          <label>Seleccione el Estudiante Inscrito:</label>
          <select 
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            onChange={manejarSeleccionInscripcion}
          >
            <option value="">Seleccione...</option>
            {inscripciones.map(insc => {
              const nombreEst = obtenerNombreEstudiante(insc);
              const gradoTexto = obtenerGradoPorSeccion(insc.id_seccion);
              return (
                <option key={insc.id_inscripcion || insc.id} value={insc.id_inscripcion || insc.id}>
                  {nombreEst} {gradoTexto ? `(${gradoTexto})` : ''}
                </option>
              );
            })}
          </select>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button className="boton-primario" onClick={() => window.print()} style={{ padding: '12px 20px' }}>
            🖨️ Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      {/* Controles de edición manual de texto */}
      <div style={{ maxWidth: '800px', margin: '0 auto 20px auto', display: 'flex', gap: '10px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <input name="gradoCursando" placeholder="Grado" value={datos.gradoCursando} onChange={manejarCambio} style={{ flex: 1, padding: '8px' }}/>
        <input name="anioEscolar" placeholder="Año Escolar" value={datos.anioEscolar} onChange={manejarCambio} style={{ flex: 1, padding: '8px' }}/>
        <input name="dia" placeholder="Día" value={datos.dia} onChange={manejarCambio} style={{ width: '80px', padding: '8px' }}/>
        <input name="mes" placeholder="Mes" value={datos.mes} onChange={manejarCambio} style={{ flex: 1, padding: '8px' }}/>
        <input name="anio" placeholder="Año" value={datos.anio} onChange={manejarCambio} style={{ width: '80px', padding: '8px' }}/>
      </div>

      {/* HOJA DE LA CONSTANCIA */}
      <div className="constancia-hoja">
        <div className="constancia-header">
          <div style={{ width: '25%' }}>
            <img src="/logo_edu.jpg" alt="Logo" style={{ width: '200px' }} />
          </div>
          <div style={{ width: '40%' }}>
            <strong>República Bolivariana de Venezuela</strong><br/>
            Ministerio del Poder Popular para la Educación<br/>
            E.E. "JUANA RAMÍREZ"<br/>
            Código Plantel: OD10312015<br/>
            Palo Gordo - Estado Táchira
          </div>
          <div style={{ width: '25%' }}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '80px' }} />
          </div>
        </div>

        <div className="constancia-titulo">CONSTANCIA DE ESTUDIO</div>

        <div className="constancia-texto">
          <p style={{ textAlign: "justify", lineHeight: 2.5 }}>
          Quien suscribe: <span>MGS. FORERO DE SANCHEZ YORLETH ANDREINA</span>, titular de la
          Cédula de Identidad N° <span>V-16.695.245</span>, Directora (E) de la <span>Escuela Estadal Juana 
          Ramírez</span>, Código <span> DEA OD10312015, </span> ubicada en Palo Gordo, Aldea 5 de julio, 
          Municipio Capacho Viejo; hace constar por medio de la presente que el (la) estudiante:
          <span style={{ display: 'inline-block', width: '97%', borderBottom: '1px solid #000', marginTop: '10px' }}>
            {inscripcionSeleccionada 
            ? obtenerNombreEstudiante(inscripcionSeleccionada) 
            : ''}
          </span>,<br/>Cursa el <span>{datos.gradoCursando} </span> 
          de Educación Primaria en esta institución, Año 
          Escolar <span>{datos.anioEscolar}</span>.</p>
          <br/>
          <p>Constancia que se expide a petición de parte interesada en la Comunidad de 
          Palo Gordo del Municipio Capacho Viejo, a los <span>{datos.dia}</span> días, del mes de <span>{datos.mes}</span>
          de <span>{datos.anio}</span>.</p>
        </div>

        <div className="constancia-firmas">
          <div>
            <br/><br/><br/>
            <strong>MGS. FORERO DE SANCHEZ YORLETH ANDREINA</strong><br/>
            C.I. No. V-16.695.245<br/>
            Directora (E)
          </div>
        </div>

        <div style={{ 
          position: 'absolute', 
          bottom: '40px', 
          left: '0', 
          width: '100%', 
          textAlign: 'center', 
          fontSize: '11px', 
          color: '#333',
          fontWeight: 'bold'
        }}>
          Palo Gordo, Aldea 5 de Julio, Municipio Capacho Viejo Libertad Teléfono N° 0276-788.49.96
        </div>
      </div>
    </div>
  );
}