import { useState, useEffect, useMemo } from 'react';
import {
  getHorarios,
  getHorariosPorDocente,
  createHorario,
  updateHorario,
  deleteHorario,
} from '../services/horarioService';
import { getDocentes } from '../services/docenteService';
import { getAulas } from '../services/aulaService';
import { getSecciones } from '../services/seccionService';
import { getGrados } from '../services/gradoService';
import { getAsignaturas } from '../services/asignaturaService';

export default function Horarios() {
  const [horarios, setHorarios] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [grados, setGrados] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroDocente, setFiltroDocente] = useState('');

  const rolActual = localStorage.getItem('sesion_juana')?.toLowerCase();
  const idDocenteLogueado = localStorage.getItem('id_docente');

  const [formulario, setFormulario] = useState({
    dia: 'Lunes',
    hora_inicio: '08:00:00',
    hora_fin: '09:35:00',
    id_aula: '',
    id_seccion: '',
    id_asig: '',
    id_docent: '',
  });

  const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    setCargando(true);
    try {
      const [docData, aulData, secData, asigData, gradData] = await Promise.all([
        getDocentes(),
        getAulas(),
        getSecciones(),
        getAsignaturas(),
        getGrados()
      ]);

      setDocentes(docData);
      setAulas(aulData);
      setSecciones(secData);
      setAsignaturas(asigData);
      setGrados(gradData);

      // Cargar horarios según el rol / filtro
      if (rolActual === 'docente') {
        const idUserLogueado = localStorage.getItem('id_docente');
        const docenteEncontrado = docData.find(
          (d) => String(d.id_user) === String(idUserLogueado)
        );

        if (!docenteEncontrado) {
          alert('No se encontró tu perfil de docente. Contacta al administrador.');
          setHorarios([]);
          return;
        }

        const horData = await getHorariosPorDocente(docenteEncontrado.id_docen);
        setHorarios(Array.isArray(horData) ? horData : []);
      } else {
        // Admin
        if (filtroDocente) {
          const horData = await getHorariosPorDocente(filtroDocente);
          setHorarios(Array.isArray(horData) ? horData : []);
        } else {
          const horData = await getHorarios();
          setHorarios(Array.isArray(horData) ? horData : []);
        }
      }
    } catch (error) {
      console.error('Error al cargar datos de horarios:', error);
      alert('No se pudieron cargar los datos necesarios para el horario.');
      setHorarios([]);
    } finally {
      setCargando(false);
    }
  };

  const manejarFiltroAdmin = async (e) => {
    const idSeleccionado = e.target.value;
    setFiltroDocente(idSeleccionado);
    setCargando(true);
    try {
      if (!idSeleccionado) {
        const todos = await getHorarios();
        setHorarios(Array.isArray(todos) ? todos : []);
      } else {
        const filtrados = await getHorariosPorDocente(idSeleccionado);
        setHorarios(Array.isArray(filtrados) ? filtrados : []);
      }
    } catch (error) {
      console.error('Error al filtrar horarios:', error);
      alert('No se pudieron cargar los horarios del docente.');
      setHorarios([]);
    } finally {
      setCargando(false);
    }
  };

  // Helpers de nombres
  const obtenerNombreGrado = (idGrado) => {
    const grado = grados.find((g) => g.id_grad === idGrado);
    return grado ? grado.descripcion || grado.nombre : `Grado ${idGrado}`;
  };

  const obtenerNombreSeccionCompleta = (idSeccion) => {
    const sec = secciones.find((s) => s.id_seccion === idSeccion);
    if (!sec) return 'Sin sección';
    return `${obtenerNombreGrado(sec.id_grado)} - Sección ${sec.descripcion}`;
  };

  const obtenerNombreAsignatura = (id) => {
    const a = asignaturas.find((x) => x.id_asign === id);
    return a ? a.descripcion : 'Sin asignatura';
  };

  const obtenerNombreDocente = (id) => {
    const d = docentes.find((x) => x.id_docen === id);
    return d ? `${d.nom} ${d.apell}` : 'Sin asignar';
  };

  const obtenerNombreAula = (id) => {
    const a = aulas.find((x) => x.id_aula === id);
    return a ? a.descripcion : 'Sin aula';
  };

  const COLORES = [
    '#3182ce', // azul
    '#38a169', // verde
    '#d69e2e', // amarillo
    '#dd6b20', // naranja
    '#805ad5', // morado
    '#e53e3e', // rojo
    '#319795', // teal
    '#d53f8c', // rosa
  ];

  const colorPorAsignatura = (idAsig) => {
    if (!idAsig) return COLORES[0];
    return COLORES[Number(idAsig) % COLORES.length];
  };

  const formatearHora = (h) => {
    if (!h) return '';
    return String(h).slice(0, 5); // 08:00:00 → 08:00
  };

  const mostrarVistaCuadricula =
  rolActual === 'docente' || (rolActual === 'admin' && filtroDocente !== '');

  // Búsqueda
  const horariosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return horarios;

    return horarios.filter((h) => {
      const dia = String(h.dia || '').toLowerCase();
      const hora = `${h.hora_inicio} - ${h.hora_fin}`.toLowerCase();
      const aula = obtenerNombreAula(h.id_aula).toLowerCase();
      const seccion = obtenerNombreSeccionCompleta(h.id_seccion).toLowerCase();
      const asig = obtenerNombreAsignatura(h.id_asig).toLowerCase();
      const doc = obtenerNombreDocente(h.id_docent).toLowerCase();

      return (
        dia.includes(q) ||
        hora.includes(q) ||
        aula.includes(q) ||
        seccion.includes(q) ||
        asig.includes(q) ||
        doc.includes(q)
      );
    });
  }, [horarios, busqueda, aulas, secciones, grados, asignaturas, docentes]);

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const limpiarFormulario = () => {
    setFormulario({
      dia: 'Lunes',
      hora_inicio: '08:00:00',
      hora_fin: '09:35:00',
      id_aula: '',
      id_seccion: '',
      id_asig: '',
      id_docent: '',
    });
    setModoEdicion(false);
    setIdEditando(null);
  };

  const abrirCrear = () => {
    limpiarFormulario();
    setMostrarFormulario(true);
  };

  const abrirEditar = (h) => {
    setFormulario({
      dia: h.dia || 'Lunes',
      hora_inicio: h.hora_inicio || '08:00:00',
      hora_fin: h.hora_fin || '09:35:00',
      id_aula: h.id_aula || '',
      id_seccion: h.id_seccion || '',
      id_asig: h.id_asig || '',
      id_docent: h.id_docent || '',
    });
    setIdEditando(h.id_horario);
    setModoEdicion(true);
    setMostrarFormulario(true);
  };

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

      await recargarHorarios();
    } catch (error) {
      console.error("DETALLE DEL ERROR DE FASTAPI:", error.response?.data);
      alert('Error al guardar el horario: ' + JSON.stringify(error.response?.data?.detail || error.message));
    }
  };

  const eliminarHorarioId = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este bloque de horario?')) {
      try {
        await deleteHorario(id);
        await recargarHorarios(); // ✅ igual que al guardar
      } catch (error) {
        console.error(error);
        alert('No se pudo eliminar el horario.');
      }
    }
  };

  return (
    <div>
      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h1>Horarios de Clases</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => window.print()}
            style={{
              background: '#4a5568',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            🖨️ Imprimir
          </button>
          {rolActual !== 'docente' && (
            <button className="boton-primario" onClick={abrirCrear}>
              {mostrarFormulario && !modoEdicion ? 'Cancelar' : '+ Asignar Horario'}
            </button>
          )}
        </div>
      </div>

      {/* Formulario crear / editar */}
      {mostrarFormulario && rolActual !== 'docente' && (
        <div className="tarjeta" style={{ marginBottom: '20px' }}>
          <h3>{modoEdicion ? 'Editar Bloque de Horario' : 'Asignar Nuevo Bloque de Horario'}</h3>
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
                <label>Hora Inicio (24h)</label>
                <input
                  type="text"
                  name="hora_inicio"
                  value={formulario.hora_inicio}
                  onChange={manejarCambio}
                  placeholder="08:00:00"
                  required
                />
              </div>

              <div className="campo-formulario">
                <label>Hora Fin (24h)</label>
                <input
                  type="text"
                  name="hora_fin"
                  value={formulario.hora_fin}
                  onChange={manejarCambio}
                  placeholder="09:35:00"
                  required
                />
              </div>

              <div className="campo-formulario">
                <label>Aula</label>
                <select name="id_aula" value={formulario.id_aula} onChange={manejarCambio} required>
                  <option value="">Seleccione un aula...</option>
                  {aulas.map((a) => (
                    <option key={a.id_aula} value={a.id_aula}>
                      {a.descripcion}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo-formulario">
                <label>Sección</label>
                <select name="id_seccion" value={formulario.id_seccion} onChange={manejarCambio} required>
                  <option value="">Seleccione una sección...</option>
                  {secciones.map((s) => (
                    <option key={s.id_seccion} value={s.id_seccion}>
                      {obtenerNombreGrado(s.id_grado)} - Sección {s.descripcion}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo-formulario">
                <label>Asignatura</label>
                <select name="id_asig" value={formulario.id_asig} onChange={manejarCambio} required>
                  <option value="">Seleccione una asignatura...</option>
                  {asignaturas.map((asig) => (
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
                  {docentes.map((doc) => (
                    <option key={doc.id_docen} value={doc.id_docen}>
                      {doc.nom} {doc.apell}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <button type="submit" className="boton-primario">
                {modoEdicion ? 'Actualizar Bloque' : 'Guardar Bloque'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMostrarFormulario(false);
                  limpiarFormulario();
                }}
                style={{
                  background: '#e2e8f0',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Listado */}
      <div className="tarjeta">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <h3>
            {rolActual === 'docente'
              ? 'Mi Horario de Clases'
              : `Horarios Registrados (${horariosFiltrados.length})`}
          </h3>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Búsqueda */}
            <input
              type="text"
              placeholder="Buscar por día, aula, sección, docente..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e0',
                minWidth: '220px',
              }}
            />

            {/* Filtro admin */}
            {rolActual === 'admin' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Docente:</label>
                <select
                  value={filtroDocente}
                  onChange={manejarFiltroAdmin}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                >
                  <option value="">Todos</option>
                  {docentes.map((doc) => (
                    <option key={doc.id_docen} value={doc.id_docen}>
                      {doc.nom} {doc.apell}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {cargando ? (
          <p>Cargando horarios...</p>
        ) : horariosFiltrados.length === 0 ? (
          <p>No hay horarios que coincidan con la búsqueda o no hay horarios asignados.</p>
        ) : mostrarVistaCuadricula ? (
          /* ========== VISTA TIPO HORARIO ESCOLAR ========== */
          <div style={{ overflowX: 'auto' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '90px repeat(5, minmax(140px, 1fr))',
                gap: '8px',
                minWidth: '800px',
              }}
            >
              {/* Cabecera */}
              <div style={{ fontWeight: 'bold', textAlign: 'center', padding: '10px' }}>
                Hora
              </div>
              {DIAS.map((dia) => (
                <div
                  key={dia}
                  style={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: '10px',
                    background: '#edf2f7',
                    borderRadius: '8px',
                  }}
                >
                  {dia}
                </div>
              ))}

              {/* Filas por cada bloque horario único */}
              {(() => {
                // Bloques únicos ordenados por hora_inicio
                const bloques = [
                  ...new Map(
                    horariosFiltrados.map((h) => [
                      `${formatearHora(h.hora_inicio)}-${formatearHora(h.hora_fin)}`,
                      {
                        inicio: formatearHora(h.hora_inicio),
                        fin: formatearHora(h.hora_fin),
                        key: `${formatearHora(h.hora_inicio)}-${formatearHora(h.hora_fin)}`,
                      },
                    ])
                  ).values(),
                ].sort((a, b) => a.inicio.localeCompare(b.inicio));

                return bloques.map((bloque) => (
                  <div key={bloque.key} style={{ display: 'contents' }}>
                    {/* Columna de hora */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f7fafc',
                        borderRadius: '8px',
                        padding: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#4a5568',
                      }}
                    >
                      {bloque.inicio}
                      <br />
                      {bloque.fin}
                    </div>

                    {/* Celdas por día */}
                    {DIAS.map((dia) => {
                      const clase = horariosFiltrados.find(
                        (h) =>
                          h.dia === dia &&
                          formatearHora(h.hora_inicio) === bloque.inicio &&
                          formatearHora(h.hora_fin) === bloque.fin
                      );

                      if (!clase) {
                        return (
                          <div
                            key={`${bloque.key}-${dia}`}
                            style={{
                              minHeight: '90px',
                              background: '#fafafa',
                              borderRadius: '8px',
                              border: '1px dashed #e2e8f0',
                            }}
                          />
                        );
                      }

                      const color = colorPorAsignatura(clase.id_asig);

                      return (
                        <div
                          key={`${bloque.key}-${dia}`}
                          style={{
                            minHeight: '90px',
                            background: color,
                            color: 'white',
                            borderRadius: '10px',
                            padding: '10px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                          }}
                        >
                          <strong style={{ fontSize: '14px', lineHeight: 1.2 }}>
                            {obtenerNombreAsignatura(clase.id_asig)}
                          </strong>
                          <span style={{ fontSize: '12px', opacity: 0.95 }}>
                            {obtenerNombreSeccionCompleta(clase.id_seccion)}
                          </span>
                          <span style={{ fontSize: '12px', opacity: 0.9 }}>
                            📍 {obtenerNombreAula(clase.id_aula)}
                          </span>
                          {rolActual === 'admin' && (
                            <span style={{ fontSize: '11px', opacity: 0.85 }}>
                              👤 {obtenerNombreDocente(clase.id_docent)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ));
              })()}
            </div>

            {/* Leyenda rápida */}
            <p style={{ marginTop: '16px', fontSize: '13px', color: '#718096' }}>
              Cada color representa una asignatura. Vista de horario semanal.
            </p>
          </div>
        ) : (
          /* ========== TABLA NORMAL (Admin → Todos) ========== */
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
              {horariosFiltrados.map((h) => (
                <tr key={h.id_horario}>
                  <td>{h.dia}</td>
                  <td>
                    {formatearHora(h.hora_inicio)} - {formatearHora(h.hora_fin)}
                  </td>
                  <td>{obtenerNombreAula(h.id_aula)}</td>
                  <td>{obtenerNombreSeccionCompleta(h.id_seccion)}</td>
                  <td>{obtenerNombreAsignatura(h.id_asig)}</td>
                  <td>{obtenerNombreDocente(h.id_docent)}</td>
                  <td className="acciones-tabla">
                    <button
                      onClick={() => eliminarHorarioId(h.id_horario)}
                      style={{
                        background: '#e53e3e',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}