import { useState, useEffect } from 'react';
import { getEstudiantes, createEstudiante, deleteEstudiante } from '../services/estudianteService';

export default function Estudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [cargando, setCargando] = useState(false);

  const [formulario, setFormulario] = useState({
    nom: '',
    apell: '',
    fecha_nac: '',
    genero: 'Masculino',
    observaciones_med: ''
  });

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    try {
      setCargando(true);
      const data = await getEstudiantes();
      setEstudiantes(data);
    } catch (error) {
      console.error(error);
      alert('Error al cargar los estudiantes.');
    } finally {
      setCargando(false);
    }
  };

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const guardarEstudiante = async (e) => {
    e.preventDefault();
    try {
      await createEstudiante(formulario);
      alert('¡Estudiante registrado con éxito!');
      setFormulario({ nom: '', apell: '', fecha_nac: '', genero: 'Masculino', observaciones_med: '' });
      setMostrarForm(false);
      cargarEstudiantes();
    } catch (error) {
      console.error(error);
      alert('Error al registrar el estudiante.');
    }
  };

  const eliminarEstudianteId = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este estudiante?')) {
      try {
        await deleteEstudiante(id);
        cargarEstudiantes();
      } catch (error) {
        console.error(error);
        alert('No se pudo eliminar el estudiante.');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Gestión de Estudiantes</h1>
        <button className="boton-primario" onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? 'Cancelar' : '+ Nuevo Estudiante'}
        </button>
      </div>

      {mostrarForm && (
        <div className="tarjeta" style={{ marginBottom: '20px' }}>
          <h3>Registrar Nuevo Estudiante</h3>
          <form onSubmit={guardarEstudiante}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <div className="campo-formulario">
                <label>Nombre</label>
                <input type="text" name="nom" value={formulario.nom} onChange={manejarCambio} required />
              </div>
              <div className="campo-formulario">
                <label>Apellido</label>
                <input type="text" name="apell" value={formulario.apell} onChange={manejarCambio} required />
              </div>
              <div className="campo-formulario">
                <label>Fecha de Nacimiento</label>
                <input type="date" name="fecha_nac" value={formulario.fecha_nac} onChange={manejarCambio} required />
              </div>
              <div className="campo-formulario">
                <label>Género</label>
                <select name="genero" value={formulario.genero} onChange={manejarCambio}>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
              </div>
              <div className="campo-formulario" style={{ gridColumn: 'span 2' }}>
                <label>Observaciones Médicas</label>
                <input type="text" name="observaciones_med" value={formulario.observaciones_med} onChange={manejarCambio} placeholder="Alergias, condiciones, etc." />
              </div>
            </div>
            <button type="submit" className="boton-primario" style={{ marginTop: '20px' }}>Guardar Estudiante</button>
          </form>
        </div>
      )}

      <div className="tarjeta">
        <h3>Estudiantes Registrados ({estudiantes.length})</h3>
        {cargando ? <p>Cargando...</p> : (
          <table className="tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre y Apellido</th>
                <th>F. Nacimiento</th>
                <th>Género</th>
                <th>Cédula Escolar</th>
                <th>Estado</th>
                <th className="acciones-tabla">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map(e => (
                <tr key={e.id_studs}>
                  <td>{e.id_studs}</td>
                  <td><strong>{e.nom} {e.apell}</strong></td>
                  <td>{e.fecha_nac}</td>
                  <td>{e.genero || 'N/A'}</td>
                  <td>{e.cedula_esco_cedula || 'Pendiente por Asignar'}</td>
                  <td>{e.is_active ? 'Activo' : 'Inactivo'}</td>
                  <td className="acciones-tabla">
                    <button onClick={() => eliminarEstudianteId(e.id_studs)} style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Eliminar</button>
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