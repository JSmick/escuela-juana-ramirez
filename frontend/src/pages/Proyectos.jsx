import { useState, useEffect } from 'react';
import { getProyectos, createProyecto, deleteProyecto } from '../services/proyectoService';
import { getDocentes } from '../services/docenteService';

export default function Proyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [cargando, setCargando] = useState(false);

  const [formulario, setFormulario] = useState({
    titulo_proyecto: '',
    lapso_ejecu: '',
    estado_proyec: 'En Ejecución',
    id_docente: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [proyData, docData] = await Promise.all([
        getProyectos(),
        getDocentes()
      ]);
      setProyectos(proyData);
      setDocentes(docData);
    } catch (error) {
      console.error(error);
      alert('Error al cargar la información de proyectos.');
    } finally {
      setCargando(false);
    }
  };

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const guardarProyecto = async (e) => {
    e.preventDefault();
    try {
      const datosAEnviar = {
        ...formulario,
        id_docente: Number(formulario.id_docente)
      };

      await createProyecto(datosAEnviar);
      alert('¡Proyecto PEIC registrado con éxito!');
      setFormulario({ titulo_proyecto: '', lapso_ejecu: '', estado_proyec: 'En Ejecución', id_docente: '' });
      setMostrarForm(false);
      cargarDatos();
    } catch (error) {
      console.error(error);
      alert('Error al registrar el proyecto.');
    }
  };

  const obtenerNombreDocente = (id) => {
    if (!id) return 'Sin asignar';
    const docente = docentes.find((d) => d.id_docen === id);
    return docente ? `${docente.nom} ${docente.apell}` : 'No encontrado';
  };

  const eliminarProyectoId = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este proyecto?')) {
      try {
        await deleteProyecto(id);
        cargarDatos();
      } catch (error) {
        console.error(error);
        alert('No se pudo eliminar el proyecto.');
      }
    }
  };


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Gestión de Proyectos PEIC</h1>
        <button className="boton-primario" onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? 'Cancelar' : '+ Nuevo Proyecto'}
        </button>
      </div>

      {mostrarForm && (
        <div className="tarjeta" style={{ marginBottom: '20px' }}>
          <h3>Registrar Proyecto Educativo</h3>
          <form onSubmit={guardarProyecto}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              
              <div className="campo-formulario" style={{ gridColumn: 'span 2' }}>
                <label>Título del Proyecto</label>
                <input 
                  type="text" 
                  name="titulo_proyecto" 
                  value={formulario.titulo_proyecto} 
                  onChange={manejarCambio} 
                  maxLength={50} 
                  required 
                />
              </div>

              <div className="campo-formulario">
                <label>Lapso de Ejecución (Ej: I Lapso)</label>
                <input 
                  type="text" 
                  name="lapso_ejecu" 
                  value={formulario.lapso_ejecu} 
                  onChange={manejarCambio} 
                  maxLength={10} 
                  required 
                />
              </div>

              <div className="campo-formulario">
                <label>Estado del Proyecto</label>
                <select name="estado_proyec" value={formulario.estado_proyec} onChange={manejarCambio} required>
                  <option value="En Ejecución">En Ejecución</option>
                  <option value="Completado">Completado</option>
                  <option value="Planificado">Planificado</option>
                </select>
              </div>

              <div className="campo-formulario" style={{ gridColumn: 'span 2' }}>
                <label>Docente Responsable</label>
                <select name="id_docente" value={formulario.id_docente} onChange={manejarCambio} required>
                  <option value="">Seleccione un docente</option>
                  {docentes.map(d => (
                    <option key={d.id_docente} value={d.id_docente}>
                      {d.nom} {d.apell} ({d.cedula})
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <button type="submit" className="boton-primario" style={{ marginTop: '20px' }}>
              Guardar Proyecto
            </button>
          </form>
        </div>
      )}

      <div className="tarjeta">
        <h3>Proyectos Registrados ({proyectos.length})</h3>
        {cargando ? <p>Cargando...</p> : (
          <table className="tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título del Proyecto</th>
                <th>Lapso</th>
                <th>Estado</th>
                <th>Docente</th>
                <th className="acciones-tabla">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proyectos.map(p => (
                <tr key={p.id_proyecto}>
                  <td>{p.id_proyecto}</td>
                  <td><strong>{p.titulo_proyecto}</strong></td>
                  <td>{p.lapso_ejecu}</td>
                  <td>{p.estado_proyec}</td>
                  <td>{obtenerNombreDocente(p.id_docente)}</td>
                  <td className="acciones-tabla">
                    <button onClick={() => eliminarProyectoId(p.id_proyecto)} style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
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