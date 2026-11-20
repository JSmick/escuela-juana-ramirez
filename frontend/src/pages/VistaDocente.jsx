import { useState, useEffect } from 'react';
import { createAsistencia, getAsistenciasPorSeccion } from '../services/asistenciaService';
import { createCalificacion, getCalificacionesEstudiante, getCalificaciones } from '../services/calificacionService';
import { getEstudiantes } from '../services/estudianteService';
import { getSecciones } from '../services/seccionService';
import { getGrados } from '../services/gradoService';
import { getAsignaturas } from '../services/asignaturaService';

export default function VistaDocente() {
  const [pestanaActiva, setPestanaActiva] = useState('asistencia');
  
  // Catálogos
  const [estudiantes, setEstudiantes] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [grados, setGrados] = useState([]);

  // --- ESTADOS PARA ASISTENCIA ---
  const [formAsistencia, setFormAsistencia] = useState({
    id_estudiante: '',
    estado: 'Presente',
    observacion: '',
    id_seccion: '',
    id_asignatura: '',
    fecha: new Date().toISOString().split('T')[0]
  });
  const [historialAsistencias, setHistorialAsistencias] = useState([]);

  // --- ESTADOS PARA CALIFICACIONES ---
  const [formNota, setFormNota] = useState({
    id_estudiante: '',
    id_asignatura: '',
    lapso_periodo: '1er Lapso',
    nota: 'A',
    observacion: ''
  });
  const [historialCalificaciones, setHistorialCalificaciones] = useState([]);

  // --- ESTADOS PARA BOLETÍN ---
  const [estudianteBoletin, setEstudianteBoletin] = useState('');
  const [notasBoletin, setNotasBoletin] = useState([]);

  // --- ESTADOS PARA INCIDENCIAS ---
  const [observacion, setObservacion] = useState({ estudianteId: '', texto: '', tipo: 'Académica' });
  const [historialObs, setHistorialObs] = useState([]);

  useEffect(() => {
    cargarDatos();
    setHistorialObs(JSON.parse(localStorage.getItem('session_juana') || '[]'));
  }, []);

  useEffect(() => { 
    localStorage.setItem('session_juana', JSON.stringify(historialObs)); 
  }, [historialObs]);

  const cargarDatos = async () => {
    try {
      const [est, sec, asig, gra, califs] = await Promise.all([
        getEstudiantes(),
        getSecciones(),
        getAsignaturas(),
        getGrados(),
        getCalificaciones()
      ]);
      setEstudiantes(est || []);
      setSecciones(sec || []);
      setAsignaturas(asig || []);
      setGrados(gra || []);
      setHistorialCalificaciones(califs || []);
    } catch (error) {
      console.error("Error cargando catálogos:", error);
    }
  };

  const obtenerNombreSeccionCompleta = (idSeccion) => {
    const sec = secciones.find(s => s.id_seccion === idSeccion);
    if (!sec) return 'Seleccione...';
    
    const gra = grados.find(g => g.id_grad === sec.id_grado);
    
    if (gra) {
      return `${gra.descripcion} - Sección ${sec.descripcion}`;
    }
    return `Sección ${sec.descripcion}`;
  };

  // --- LÓGICA: GUARDAR ASISTENCIA ---
  const guardarAsistencia = async (e) => {
    e.preventDefault();
    if (!formAsistencia.id_estudiante || !formAsistencia.id_seccion || !formAsistencia.id_asignatura) {
      return alert('Debe seleccionar estudiante, sección y asignatura.');
    }

    const datosParaAPI = {
      fecha: formAsistencia.fecha,
      estado: formAsistencia.estado,
      observacion: formAsistencia.observacion || null,
      id_estudiante: Number(formAsistencia.id_estudiante),
      id_seccion: Number(formAsistencia.id_seccion),
      id_asignatura: Number(formAsistencia.id_asignatura)
    };

    try {
      await createAsistencia(datosParaAPI);
      alert('✅ ¡Asistencia guardada exitosamente!');
      setFormAsistencia({ ...formAsistencia, id_estudiante: '', observacion: '' });
      if (formAsistencia.id_seccion) cargarHistorialAsistencias(formAsistencia.id_seccion);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || '❌ Error al guardar la asistencia.');
    }
  };

  const cargarHistorialAsistencias = async (idSeccion) => {
    if (!idSeccion) return setHistorialAsistencias([]);
    try {
      const data = await getAsistenciasPorSeccion(idSeccion);
      const ordenadas = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setHistorialAsistencias(ordenadas);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    }
  };

  // --- LÓGICA: GUARDAR CALIFICACIÓN ---
  const guardarNota = async (e) => {
    e.preventDefault();
    if (!formNota.id_estudiante || !formNota.id_asignatura) {
      return alert('Debe seleccionar estudiante y asignatura.');
    }

    const datosParaAPI = {
      id_estudiante: Number(formNota.id_estudiante),
      id_asignatura: Number(formNota.id_asignatura),
      lapso_periodo: formNota.lapso_periodo,
      nota: formNota.nota,
      observacion: formNota.observacion || null
    };

    try {
      await createCalificacion(datosParaAPI);
      alert('✅ ¡Calificación guardada exitosamente!');
      setFormNota({ ...formNota, id_estudiante: '', observacion: '' });
      cargarDatos(); // 👈 AQUÍ YA ESTÁ CORREGIDO
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || '❌ Error al guardar la nota. (¿Ya existe en este lapso?)');
    }
  };

  // --- LÓGICA: CARGAR BOLETÍN ---
  const cargarBoletin = async () => {
    if (!estudianteBoletin) return;
    try {
      const data = await getCalificacionesEstudiante(estudianteBoletin);
      setNotasBoletin(data || []);
    } catch (error) {
      console.error(error);
      alert('Error al cargar las notas del boletín');
    }
  };

  // --- LÓGICA: INCIDENCIAS ---
  const guardarObservacion = (e) => {
    e.preventDefault();
    if (!observacion.estudianteId || !observacion.texto) return alert('Seleccione un alumno y escriba la observación');
    
    const alumno = estudiantes.find(est => est.id_studs === Number(observacion.estudianteId));
    const nuevaObs = {
      id: Date.now(),
      estudianteNombre: alumno ? `${alumno.nom} ${alumno.apell}` : 'Desconocido',
      texto: observacion.texto,
      tipo: observacion.tipo,
      fecha: new Date().toLocaleDateString()
    };
    
    setHistorialObs([nuevaObs, ...historialObs]);
    setObservacion({ ...observacion, texto: '' });
  };

  return (
    <div>
      <div style={{ backgroundColor: '#2c5282', color: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h1>Panel del Docente</h1>
        <p>Bienvenido. Gestione sus alumnos, asistencia y calificaciones.</p>
      </div>

      {/* PESTAÑAS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button className={pestanaActiva === 'asistencia' ? 'boton-primario' : ''} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: pestanaActiva === 'asistencia' ? '' : '#e2e8f0', border: 'none', borderRadius: '6px' }} onClick={() => setPestanaActiva('asistencia')}> Control de Asistencia </button>
        <button className={pestanaActiva === 'notas' ? 'boton-primario' : ''} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: pestanaActiva === 'notas' ? '' : '#e2e8f0', border: 'none', borderRadius: '6px' }} onClick={() => setPestanaActiva('notas')}> Carga de Calificaciones </button>
        <button className={pestanaActiva === 'boletin' ? 'boton-primario' : ''} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: pestanaActiva === 'boletin' ? '' : '#e2e8f0', border: 'none', borderRadius: '6px' }} onClick={() => setPestanaActiva('boletin')}>  Resumen / Boletín </button>
        <button className={pestanaActiva === 'observaciones' ? 'boton-primario' : ''} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: pestanaActiva === 'observaciones' ? '' : '#e2e8f0', border: 'none', borderRadius: '6px' }} onClick={() => setPestanaActiva('observaciones')}> Registro de Incidencias </button>
      </div>

      {/* ASISTENCIA */}
      {pestanaActiva === 'asistencia' && (
        <div className="tarjeta">
          <h3>Registrar Asistencia Diaria</h3>
          <form onSubmit={guardarAsistencia}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="campo-formulario">
                <label>Fecha</label>
                <input type="date" value={formAsistencia.fecha} onChange={(e) => setFormAsistencia({...formAsistencia, fecha: e.target.value})} required />
              </div>
              <div className="campo-formulario" style={{ gridColumn: 'span 2' }}>
                <label>Estudiante *</label>
                <select value={formAsistencia.id_estudiante} onChange={(e) => setFormAsistencia({...formAsistencia, id_estudiante: e.target.value})} required>
                  <option value="">Seleccione al alumno...</option>
                  {estudiantes.map(est => (
                    <option key={est.id_studs} value={est.id_studs}>{est.apell}, {est.nom} - {est.cedula || 'Sin cédula'}</option>
                  ))}
                </select>
              </div>
              <div className="campo-formulario">
                <label>Sección</label>
                {/* 👇 AQUÍ ESTÁ LA MAGIA QUE FALTABA */}
                <select 
                  value={formAsistencia.id_seccion} 
                  onChange={(e) => {
                    const idSec = e.target.value;
                    setFormAsistencia({...formAsistencia, id_seccion: idSec});
                    cargarHistorialAsistencias(idSec);
                  }} 
                  required
                >
                  <option value="">Seleccione...</option>
                  {secciones.map(s => (
                    <option key={s.id_seccion} value={s.id_seccion}>
                      {obtenerNombreSeccionCompleta(s.id_seccion)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="campo-formulario">
                <label>Asignatura</label>
                <select value={formAsistencia.id_asignatura} onChange={(e) => setFormAsistencia({...formAsistencia, id_asignatura: e.target.value})} required>
                  <option value="">Seleccione...</option>
                  {asignaturas.map(a => <option key={a.id_asign} value={a.id_asign}>{a.descripcion}</option>)}
                </select>
              </div>
              <div className="campo-formulario">
                <label>Estado</label>
                <select value={formAsistencia.estado} onChange={(e) => setFormAsistencia({...formAsistencia, estado: e.target.value})}>
                  <option value="Presente">Presente</option>
                  <option value="Ausente">Ausente</option>
                  <option value="Justificado">Justificado</option>
                  <option value="Retraso">Retraso</option>
                </select>
              </div>
            </div>
            <div className="campo-formulario">
              <label>Observación (Opcional)</label>
              <input placeholder="Ej: Trajo justificante..." value={formAsistencia.observacion} onChange={(e) => setFormAsistencia({...formAsistencia, observacion: e.target.value})} />
            </div>
            <button type="submit" className="boton-primario" style={{ marginTop: '10px' }}>Guardar Asistencia</button>
          </form>
          {formAsistencia.id_seccion && (
            <div style={{ marginTop: '30px', borderTop: '2px solid #e2e8f0', paddingTop: '20px' }}>
              <h4 style={{ color: '#2c5282', marginBottom: '15px' }}>Historial de Asistencias de esta Sección</h4>
              {historialAsistencias.length === 0 ? (
                <p style={{ color: '#718096' }}>No hay asistencias registradas para esta sección.</p>
              ) : (
                <table className="tabla" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#edf2f7' }}>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Fecha</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Estudiante</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Estado</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Observación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historialAsistencias.map((ast) => {
                      const alumno = estudiantes.find(e => e.id_studs === ast.id_estudiante);
                      const nombreAlumno = alumno ? `${alumno.apell}, ${alumno.nom}` : `ID ${ast.id_estudiante}`;
                      let colorEstado = '#4a5568';
                      if (ast.estado === 'Presente') colorEstado = 'green';
                      if (ast.estado === 'Ausente') colorEstado = 'red';
                      if (ast.estado === 'Retardo') colorEstado = 'orange';

                      return (
                        <tr key={ast.id_asistencia} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '10px' }}>{ast.fecha}</td>
                          <td style={{ padding: '10px' }}>{nombreAlumno}</td>
                          <td style={{ padding: '10px', color: colorEstado, fontWeight: 'bold' }}>{ast.estado}</td>
                          <td style={{ padding: '10px', color: '#718096', fontSize: '13px' }}>{ast.observacion || '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}

      {/* CALIFICACIONES */}
      {pestanaActiva === 'notas' && (
        <div className="tarjeta">
          <h3>Carga de Calificaciones</h3>
          <p style={{ fontSize: '13px', color: '#718096', marginBottom: '15px' }}>La nota se registra con letras (A, B, C, D, E)</p>
          <form onSubmit={guardarNota}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="campo-formulario">
                <label>Estudiante</label>
                <select value={formNota.id_estudiante} onChange={(e) => setFormNota({...formNota, id_estudiante: e.target.value})} required>
                  <option value="">Seleccione...</option>
                  {estudiantes.map(est => <option key={est.id_studs} value={est.id_studs}>{est.apell}, {est.nom}</option>)}
                </select>
              </div>
              <div className="campo-formulario">
                <label>Asignatura</label>
                <select value={formNota.id_asignatura} onChange={(e) => setFormNota({...formNota, id_asignatura: e.target.value})} required>
                  <option value="">Seleccione...</option>
                  {asignaturas.map(a => <option key={a.id_asign} value={a.id_asign}>{a.descripcion}</option>)}
                </select>
              </div>
              <div className="campo-formulario">
                <label>Lapso (1, 2 o 3)</label>
                <select value={formNota.lapso_periodo} onChange={(e) => setFormNota({...formNota, lapso_periodo: e.target.value})} required> 
                  <option value="1er Lapso">1er Lapso</option>
                  <option value="2do Lapso">2do Lapso</option>
                  <option value="3er Lapso">3er Lapso</option>
                </select>
              </div>
              <div className="campo-formulario">
                <label>Nota (Letra)</label>
                <select value={formNota.nota} onChange={(e) => setFormNota({...formNota, nota: e.target.value})}>
                  <option value="A">A (Excelente)</option>
                  <option value="B">B (Bueno)</option>
                  <option value="C">C (Regular)</option>
                  <option value="D">D (Deficiente)</option>
                  <option value="E">E (Reprobado)</option>
                </select>
              </div>
            </div>
            <div className="campo-formulario">
              <label>Observación</label>
              <input placeholder="Opcional..." value={formNota.observacion} onChange={(e) => setFormNota({...formNota, observacion: e.target.value})} />
            </div>
            <button type="submit" className="boton-primario" style={{ marginTop: '15px' }}>Guardar Calificación</button>
          </form>
          <div style={{ marginTop: '30px', borderTop: '2px solid #e2e8f0', paddingTop: '20px' }}>
            <h4 style={{ color: '#2c5282', marginBottom: '15px' }}>Historial de Calificaciones Registradas</h4>
            {historialCalificaciones.length === 0 ? (
              <p style={{ color: '#718096' }}>No hay calificaciones registradas aún.</p>
            ) : (
              <table className="tabla" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#edf2f7' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Estudiante</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Asignatura</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Lapso</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Nota</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Observación</th>
                  </tr>
                </thead>
                <tbody>
                  {historialCalificaciones.map((calif) => {
                    const alumno = estudiantes.find(e => e.id_studs === calif.id_estudiante);
                    const materia = asignaturas.find(a => a.id_asign === calif.id_asignatura);
                    return (
                      <tr key={calif.id_calificacion} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '10px' }}>{alumno ? `${alumno.apell}, ${alumno.nom}` : `ID ${calif.id_estudiante}`}</td>
                        <td style={{ padding: '10px' }}>{materia ? materia.descripcion : `ID ${calif.id_asignatura}`}</td>
                        <td style={{ padding: '10px' }}>{calif.lapso_periodo}</td>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{calif.nota}</td>
                        <td style={{ padding: '10px', color: '#718096', fontSize: '13px' }}>{calif.observacion || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* BOLETÍN */}
      {pestanaActiva === 'boletin' && (
        <div className="tarjeta" id="area-boletin">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3>Resumen de Calificaciones</h3>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <select value={estudianteBoletin} onChange={(e) => setEstudianteBoletin(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="">Seleccione un estudiante...</option>
                  {estudiantes.map(est => <option key={est.id_studs} value={est.id_studs}>{est.apell}, {est.nom}</option>)}
                </select>
                <button onClick={cargarBoletin} className="boton-primario" style={{ padding: '8px 15px' }}>Buscar Notas</button>
              </div>
            </div>
            <button onClick={() => window.print()} style={{ background: '#4a5568', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>🖨️ Imprimir Boletín</button>
          </div>

          <div style={{ border: '2px solid #e2e8f0', padding: '20px', borderRadius: '8px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2>E.E. Juana Ramírez</h2>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#4a5568' }}>Reporte de Calificaciones</p>
            </div>
            <table className="tabla">
              <thead>
                <tr><th>Asignatura</th><th>Lapso</th><th>Nota</th><th>Observación</th></tr>
              </thead>
              <tbody>
                {notasBoletin.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center' }}>No hay notas registradas para este alumno.</td></tr>
                ) : (
                  notasBoletin.map(nota => {
                    const materia = asignaturas.find(a => a.id_asign === nota.id_asignatura);
                    return (
                      <tr key={nota.id_calificacion}>
                        <td>{materia ? materia.descripcion : 'Materia Desconocida'}</td>
                        <td>{nota.lapso_periodo}</td>
                        <td style={{ fontWeight: 'bold' }}>{nota.nota}</td>
                        <td>{nota.observacion || '—'}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INCIDENCIAS */}
      {pestanaActiva === 'observaciones' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="tarjeta">
            <h3>Nueva Observación</h3>
            <form onSubmit={guardarObservacion}>
              <div className="campo-formulario">
                <label>Seleccionar Alumno</label>
                <select value={observacion.estudianteId} onChange={(e) => setObservacion({...observacion, estudianteId: e.target.value})} required>
                  <option value="">Seleccione...</option>
                  {estudiantes.map(est => <option key={est.id_studs} value={est.id_studs}>{est.nom} {est.apell}</option>)}
                </select>
              </div>
              <div className="campo-formulario">
                <label>Tipo de Incidencia</label>
                <select value={observacion.tipo} onChange={(e) => setObservacion({...observacion, tipo: e.target.value})}>
                  <option value="Académica">Académica</option>
                  <option value="Disciplinaria">Disciplinaria</option>
                  <option value="Positiva">Positiva (Felicitación)</option>
                </select>
              </div>
              <div className="campo-formulario">
                <label>Descripción</label>
                <textarea rows="3" value={observacion.texto} onChange={(e) => setObservacion({...observacion, texto: e.target.value})} required />
              </div>
              <button type="submit" className="boton-primario">Guardar Observación</button>
            </form>
          </div>

          <div className="tarjeta">
            <h3>Historial de Incidencias</h3>
            {historialObs.length === 0 ? <p>No hay observaciones registradas.</p> : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {historialObs.map(obs => (
                  <li key={obs.id} style={{ borderBottom: '1px solid #e2e8f0', padding: '10px 0' }}>
                    <strong>{obs.estudianteNombre}</strong> - <span style={{ color: obs.tipo === 'Positiva' ? 'green' : (obs.tipo === 'Disciplinaria' ? 'red' : 'orange') }}>{obs.tipo}</span>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}>{obs.texto}</p>
                    <small style={{ color: '#a0aec0' }}>{obs.fecha}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}