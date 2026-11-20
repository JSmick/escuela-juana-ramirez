import { useState, useEffect } from 'react';
import {
  getInscripciones,
  createInscripcion,
  deleteInscripcion,
  getMisEstudiantes
} from '../services/inscripcionService';
import { getEstudiantes } from '../services/estudianteService';
import { getSecciones } from '../services/seccionService';
import { getGrados } from '../services/gradoService';
import { getAnosEscolares } from '../services/anoEscolarService';

export default function Inscripciones() {
  const [inscripciones, setInscripciones] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [grados, setGrados] = useState([]);
  const [anosEscolares, setAnosEscolares] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [cargando, setCargando] = useState(false);


  const rolActual = localStorage.getItem('sesion_juana')?.toLowerCase();
  const esAdmin = rolActual === 'admin';

  const [formulario, setFormulario] = useState({
    id_estudiante: '',
    id_seccion: '',
    id_grado: '',
    id_ano_escolar: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [inscData, estData, secData, graData, anoData] = await Promise.all([
        getInscripciones(),
        esAdmin ? getEstudiantes() : getMisEstudiantes(),
        
       // getEstudiantes(),
        getSecciones(),
        getGrados(),
        getAnosEscolares()
      ]);
      setInscripciones(inscData);
      setEstudiantes(estData);
      setSecciones(secData);
      setGrados(graData);
      setAnosEscolares(anoData);
    } catch (error) {
      console.error(error);
      alert('Error al cargar la información de inscripciones.');
    } finally {
      setCargando(false);
    }
  };

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const guardarInscripcion = async (e) => {
    e.preventDefault();
    try {
      const datosAEnviar = {
        id_estudiante: Number(formulario.id_estudiante),
        id_seccion: Number(formulario.id_seccion),
        id_grado: Number(formulario.id_grado),
        id_ano_escolar: Number(formulario.id_ano_escolar)
      };

      await createInscripcion(datosAEnviar);
      alert('¡Inscripción registrada con éxito!');

      setFormulario({ id_estudiante: '', id_seccion: '', id_grado: '', id_ano_escolar: '' });
      setMostrarForm(false);

      cargarDatos();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || 'Error al registrar la inscripción.');
    }
  };

  const eliminarInscripcionId = async (id) => {
    if (window.confirm('¿Está seguro de inactivar esta inscripción?')) {
      try {
        await deleteInscripcion(id);
        cargarDatos();
      } catch (error) {
        console.error(error);
        alert(error?.response?.data?.detail || 'No se pudo inactivar la inscripción.');
      }
    }
  };

  const obtenerNombreEstudiante = (id) => {
    const e = estudiantes.find((x) => x.id_studs === id);
    return e ? `${e.nom} ${e.apell}` : `ID ${id}`;
  };
  const obtenerNombreGrado = (id) => {
    const g = grados.find((x) => x.id_grad === id);
    return g ? g.descripcion || `ID ${id}` : `ID ${id}`;
  };
  const obtenerNombreSeccion = (id) => {
    const s = secciones.find((x) => x.id_seccion === id);
    return s ? s.descripcion || `ID ${id}` : `ID ${id}`;
  };
  const obtenerAnoEscolar = (id) => {
    const a = anosEscolares.find((x) => x.id_ano === id);
    return a ? a.nombre: `ID ${id}`;
  };

  const seccionesFiltradas = formulario.id_grado
    ? secciones.filter((s) => !s.id_grado || s.id_grado === Number(formulario.id_grado))
    : secciones;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ color: '#1e3a5f' }}>Gestión de Inscripciones</h1>

        <button className="boton-primario" onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? 'Cancelar' : '+ Nueva Inscripción'}
        </button>
      </div>

      {mostrarForm && (
        <div className="tarjeta" style={{ marginBottom: '20px' }}>
          <h3>Registrar Inscripción</h3>
          <form onSubmit={guardarInscripcion}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>

              <div className="campo-formulario" style={{ gridColumn: 'span 2' }}>
                <label>Estudiante</label>
                <select
                  name="id_estudiante"
                  value={formulario.id_estudiante}
                  onChange={manejarCambio}
                  required
                >
                  <option value="">Seleccione un estudiante</option>
                  {estudiantes.map((e) => (
                    <option key={e.id_studs} value={e.id_studs}>
                      {e.nom} {e.apell} ({e.cedula})
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo-formulario">
                <label>Grado</label>
                <select
                  name="id_grado"
                  value={formulario.id_grado}
                  onChange={(e) => {
                    setFormulario({
                      ...formulario,
                      id_grado: e.target.value,
                      id_seccion: '' // reset sección al cambiar grado
                    });
                  }}
                  required
                >
                  <option value="">Seleccione un grado</option>
                  {grados.map((g) => (
                    <option key={g.id_grad} value={g.id_grad}>
                      {g.descripcion }
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo-formulario">
                <label>Sección</label>
                <select
                  name="id_seccion"
                  value={formulario.id_seccion}
                  onChange={manejarCambio}
                  required
                  disabled={!formulario.id_grado}
                >
                  <option value="">Seleccione una sección</option>
                  {seccionesFiltradas.map((s) => (
                    <option key={s.id_seccion} value={s.id_seccion}>
                      {s.descripcion }
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo-formulario" style={{ gridColumn: 'span 2' }}>
                <label>Año Escolar</label>
                <select
                  name="id_ano_escolar"
                  value={formulario.id_ano_escolar}
                  onChange={manejarCambio}
                  required
                >
                  <option value="">Seleccione un año escolar</option>
                  {anosEscolares.map((a) => (
                    <option key={a.id_ano} value={a.id_ano}>
                    
                      {a.nombre  || a.ano}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <button type="submit" className="boton-primario" style={{ marginTop: '20px' }}>
              Guardar Inscripción
            </button>
          </form>
        </div>
      )}

      <div className="tarjeta">
        <h3 style={{ color: '#1e3a5f' }}>Inscripciones Registradas ({inscripciones.length})</h3>
        {cargando ? (
          <p>Cargando inscripciones...</p>
        ) : inscripciones.length === 0 ? (
          <p style={{ color: '#718096', textAlign: 'center', padding: '20px' }}>No hay inscripciones registradas.</p>
        ) : (
          <table className="tabla" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Estudiante</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Grado</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Sección</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Año Escolar</th>
                {/* 👇 Solo el Admin ve la columna de acciones */}
                {esAdmin && <th style={{ padding: '12px', textAlign: 'center', borderTopRightRadius: '8px' }}>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {inscripciones.map((i, index) => (
                <tr 
                  key={i.id_inscripcion} 
                  style={{ 
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc', // Efecto cebra
                    borderBottom: '1px solid #e2e8f0' 
                  }}
                >
                  <td style={{ padding: '12px', textTransform: 'capitalize' }}><strong>{obtenerNombreEstudiante(i.id_estudiante)}</strong></td>
                  <td style={{ padding: '12px' }}>{obtenerNombreGrado(i.id_grado)}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{obtenerNombreSeccion(i.id_seccion)}</td>
                  <td style={{ padding: '12px' }}>{obtenerAnoEscolar(i.id_ano_escolar)}</td>
                  
                  {/* 👇 Solo el Admin ve el botón Eliminar */}
                  {esAdmin && (
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => eliminarInscripcionId(i.id_inscripcion)}
                        style={{
                          background: '#e53e3e',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}