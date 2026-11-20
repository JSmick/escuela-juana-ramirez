import { useState, useEffect } from 'react';
import { getHorarios, getHorariosPorDocente, createHorario, deleteHorario } from '../services/horarioService';

import { getDocentes } from '../services/docenteService';
import { getAulas } from '../services/aulaService';
import { getSecciones } from '../services/seccionService';
import { getGrados } from '../services/gradoService'; // Asegúrate de importar tu servicio de grados
import { getAsignaturas } from '../services/asignaturaService';

export default function Horarios() {
  const [horarios, setHorarios] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [grados, setGrados] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(false);

  // 👉 Pégalo aquí:
  const [filtroDocente, setFiltroDocente] = useState('');
  const rolActual = localStorage.getItem('sesion_juana')?.toLowerCase();
  const idDocenteLogueado = localStorage.getItem('id_docente');

  const [formulario, setFormulario] = useState({
    dia: 'Lunes',
    hora_inicio: '08:00:00', // Formato de 24h obligatorio para FastAPI
    hora_fin: '09:35:00',     // Formato de 24h obligatorio para FastAPI
    id_aula: '',
    id_seccion: '',
    id_asig: '',
    id_docent: ''
  });

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      setCargando(true);

      const docData = await getDocentes();
      setDocentes(docData);

      let peticionHorarios;
      if (rolActual === 'docente') {

        const idUserLogueado = idDocenteLogueado;
        // const idDocente = idDocenteLogueado; Usa el ID guardado o el 5 por defecto si no lo encuentra

        const docenteEncontrado = docData.find(d => String(d.id_user) === String(idUserLogueado));

        const idDocenteReal = docenteEncontrado ? docenteEncontrado.id_docen : idUserLogueado;

        console.log("Usuario ID:", idUserLogueado, "-> Docente ID real:", idDocenteReal);

        if (!docenteEncontrado) {
        alert('No se encontró tu perfil de docente. Contacta al administrador.');
        setHorarios([]);
        return;
      }

        peticionHorarios = getHorariosPorDocente(docenteEncontrado.id_docen);
      } else {
        peticionHorarios = filtroDocente ? getHorariosPorDocente(filtroDocente) : getHorarios();
      }
      const [horData, aulData, secData, asigData, gradData] = await Promise.all([
        peticionHorarios,
        //getHorarios(),
        //getDocentes(),
        getAulas(),
        getSecciones(),
        getAsignaturas(),
        getGrados() // <-- Cargamos los grados
      ]);
      setHorarios(horData);
      setDocentes(docData);
      setAulas(aulData);
      setSecciones(secData);
      setAsignaturas(asigData);
      setGrados(gradData); // <-- Guardamos los grados en su estado
    } catch (error) {
      console.error("Error al cargar datos de horarios:", error);
      alert("No se pudieron cargar los datos necesarios para el horario.");
    } finally {
      setCargando(false);
    }
  };
  const manejarFiltroAdmin = async (e) => {
    const idSeleccionado = e.target.value;
    setFiltroDocente(idSeleccionado);
    setCargando(true);
    try {
      if (idSeleccionado === '') {
        const todos = await getHorarios();
        setHorarios(todos);
      } else {
        const filtrados = await getHorariosPorDocente(idSeleccionado);
        setHorarios(filtrados);
      }
    } catch (error) {
      console.error("Error al cargar datos de horarios:", error);
      alert("No se pudieron cargar los datos necesarios para el horario.")
    } finally {
      setCargando(false);
    }
  };

  const manejarCambio = (e) => setFormulario({ ...formulario, [e.target.name]: e.target.value });

  const guardarHorario = async (e) => {
    e.preventDefault();
    try {
      const datosAEnviar = {
        ...formulario,
        id_aula: Number(formulario.id_aula),
        id_seccion: Number(formulario.id_seccion),
        id_asig: Number(formulario.id_asig),
        id_docent: Number(formulario.id_docent)
      };

      await createHorario(datosAEnviar);
      alert('¡Bloque de horario asignado con éxito!');
      setFormulario({
        dia: 'Lunes',
        hora_inicio: '08:00:00',
        hora_fin: '09:35:00',
        id_aula: '',
        id_seccion: '',
        id_asig: '',
        id_docent: ''
      });
      setMostrarFormulario(false);
      cargarDatosIniciales();
    } catch (error) {
      console.error("DETALLE DEL ERROR DE FASTAPI:", error.response?.data); // <-- Esto nos dirá la verdad exacta
      alert('Error al guardar el horario: ' + JSON.stringify(error.response?.data?.detail || error.message));
    }
  };

  const eliminarHorarioId = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este bloque de horario?')) {
      try {
        await deleteHorario(id);
        cargarDatosIniciales();
      } catch (error) {
        console.error(error);
        alert('No se pudo eliminar el horario.');
      }
    }
  };



  // Funciones auxiliares para mostrar nombres en vez de IDs

  const obtenerNombreSeccionCompleta = (idSeccion) => {
    // 1. Buscamos la sección por su ID
    const sec = secciones.find(s => s.id_seccion === idSeccion);
    if (!sec) return 'Sin sección';

    // 2. Buscamos el grado al que pertenece esa sección usando su id_grado
    const grado = grados.find(g => g.id_grad === sec.id_grado);
    const nombreGrado = grado ? grado.descripcion || grado.nombre : '';

    // 3. Retornamos ambos combinados para que quede perfecto
    return nombreGrado ? `${nombreGrado} - Sección ${sec.descripcion}` : `Sección ${sec.descripcion}`;
  };

  const obtenerNombreAsignatura = (id) => {
    const asig = asignaturas.find(a => a.id_asign === id);
    return asig ? asig.descripcion : 'Sin asignatura';
  };

  const obtenerNombreDocente = (id) => {
    const doc = docentes.find(d => d.id_docen === id);
    return doc ? `${doc.nom} ${doc.apell}` : 'Sin asignar';
  };

  const obtenerNombreAula = (id) => {
    const aula = aulas.find(a => a.id_aula === id);
    return aula ? aula.descripcion : 'Sin aula';
  };

  const obtenerNombreSeccion = (id) => {
    const sec = secciones.find(s => s.id_seccion === id);
    return sec ? sec.descripcion : 'Sin sección';
  };

  const obtenerNombreGrado = (idGrado) => {
    const grado = grados.find(g => g.id_grad === idGrado);
    return grado ? grado.descripcion : `Grado ${idGrado}`;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Horarios de Clases</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => window.print()} style={{ background: '#4a5568', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>🖨️ Imprimir</button>
          <button className="boton-primario" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
            {mostrarFormulario ? 'Cancelar' : '+ Asignar Horario'}
          </button>
        </div>
      </div>

      {mostrarFormulario && (
        <div className="tarjeta" style={{ marginBottom: '20px' }}>
          <h3>Asignar Nuevo Bloque de Horario</h3>
          <form onSubmit={guardarHorario}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              
              <div className="campo-formulario">
                <label>Día</label>
                <select name="dia" value={formulario.dia} onChange={manejarCambio} required>
                  <option value="Lunes">Lunes</option>
                  <option value="Martes">Martes</option>
                  <option value="Miércoles">Miércoles</option>
                  <option value="Jueves">Jueves</option>
                  <option value="Viernes">Viernes</option>
                </select>
              </div>

              <div className="campo-formulario">
                <label>Hora Inicio (Formato 24h)</label>
                <input 
                  type="text" 
                  name="hora_inicio" 
                  value={formulario.hora_inicio} 
                  onChange={manejarCambio} 
                  placeholder="Ej: 08:00:00"
                  required 
                />
              </div>

              <div className="campo-formulario">
                <label>Hora Fin (Formato 24h)</label>
                <input 
                  type="text" 
                  name="hora_fin" 
                  value={formulario.hora_fin} 
                  onChange={manejarCambio} 
                  placeholder="Ej: 09:35:00"
                  required 
                />
              </div>

              <div className="campo-formulario">
                <label>Aula</label>
                <select name="id_aula" value={formulario.id_aula} onChange={manejarCambio} required>
                  <option value="">Seleccione un aula...</option>
                  {aulas.map(a => <option key={a.id_aula} value={a.id_aula}>{a.descripcion}</option>)}
                </select>
              </div>

              <div className="campo-formulario">
                <label>Sección</label>
                <select name="id_seccion" value={formulario.id_seccion} onChange={manejarCambio} required>
                  <option value="">Seleccione una sección...</option>
                  {secciones.map(s => (
                    <option key={s.id_seccion} value={s.id_seccion}>
                      {obtenerNombreGrado(s.id_grado)} - Sección {s.descripcion}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo-formulario">
                <label>Asignatura (Materia)</label>
                <select name="id_asig" value={formulario.id_asig} onChange={manejarCambio} required>
                  <option value="">Seleccione una asignatura...</option>
                  {asignaturas.map(asig => (
                    <option key={asig.id_asign} value={asig.id_asign}>
                      {asig.descripcion}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo-formulario" style={{ gridColumn: 'span 2' }}>
                <label>Docente</label>
                <select name="id_docent" value={formulario.id_docent} onChange={manejarCambio} required>
                  <option value="">Seleccione un docente...</option>
                  {docentes.map(doc => <option key={doc.id_docen} value={doc.id_docen}>{doc.nom} {doc.apell}</option>)}
                </select>
              </div>

            </div>
            <button type="submit" className="boton-primario" style={{ marginTop: '15px' }}>Guardar Bloque</button>
          </form>
        </div>
      )}

      <div className="tarjeta">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3>
          {rolActual === 'docente' ? 'Mi Horario de Clases' : `Horarios Registrados (${horarios.length})`}
        </h3>

        {/* SELECTOR SOLO VISIBLE PARA ADMIN */}
        {rolActual === 'admin' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Filtrar por Docente:</label>
            <select 
              value={filtroDocente} 
              onChange={manejarFiltroAdmin}
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
            >
              <option value="">Todos los docentes</option>
              {docentes.map(doc => (
                <option key={doc.id_docen} value={doc.id_docen}>
                  {doc.nom} {doc.apell}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
        {cargando ? <p>Cargando horarios...</p> : (
          horarios.length === 0 ? <p>No hay horarios asignados en el servidor.</p> : (
            <table className="tabla">
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Hora</th>
                  <th>Aula</th>
                  <th>Sección</th>
                  <th>Asignatura</th>
                  <th>Docente</th>
                  <th className="acciones-tabla">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {horarios.map(h => (
                  <tr key={h.id_horario}>
                    <td>{h.dia}</td>
                    <td>{h.hora_inicio} - {h.hora_fin}</td>
                    <td>{obtenerNombreAula(h.id_aula)}</td>
                    <td><strong>{obtenerNombreSeccionCompleta(h.id_seccion)}</strong></td>
                    <td><strong>{obtenerNombreAsignatura(h.id_asig)}</strong></td>
                    <td>{obtenerNombreDocente(h.id_docent)}</td>
                    <td className="acciones-tabla">
                      <button onClick={() => eliminarHorarioId(h.id_horario)} style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}