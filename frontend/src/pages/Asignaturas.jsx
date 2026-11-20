import { useState, useEffect } from 'react';
import { getAsignaturas, createAsignatura, deleteAsignatura } from '../services/asignaturaService';

export default function Asignaturas() {
  const [asignaturas, setAsignaturas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => { cargarAsignaturas(); }, []);

  const cargarAsignaturas = async () => {
    try {
      setCargando(true);
      const data = await getAsignaturas();
      setAsignaturas(data);
    } catch (error) { console.error(error); alert('Error al cargar asignaturas.'); }
    finally { setCargando(false); }
  };

  const guardarAsignatura = async (e) => {
    e.preventDefault();
    try {
      await createAsignatura({ descripcion });
      alert('¡Asignatura registrada con éxito!');
      setDescripcion('');
      setMostrarForm(false);
      cargarAsignaturas();
    } catch (error) { console.error(error); alert('Error al guardar asignatura.'); }
  };

  const eliminarAsignaturaId = async (id) => {
    if (window.confirm('¿Eliminar asignatura?')) {
      try {
        await deleteAsignatura(id);
        cargarAsignaturas();
      } catch (error) { console.error(error); alert('No se pudo eliminar.'); }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Gestión de Asignaturas</h1>
        <button className="boton-primario" onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? 'Cancelar' : '+ Nueva Asignatura'}
        </button>
      </div>

      {mostrarForm && (
        <div className="tarjeta" style={{ marginBottom: '20px' }}>
          <h3>Registrar Asignatura</h3>
          <form onSubmit={guardarAsignatura}>
            <div className="campo-formulario">
              <label>Nombre de la Asignatura (Ej: Matemática)</label>
              <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} maxLength={100} required />
            </div>
            <button type="submit" className="boton-primario" style={{ marginTop: '10px' }}>Guardar</button>
          </form>
        </div>
      )}

      <div className="tarjeta">
        <h3>Asignaturas Registradas ({asignaturas.length})</h3>
        {cargando ? <p>Cargando...</p> : (
          <table className="tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th className="acciones-tabla">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {asignaturas.map(a => (
                <tr key={a.id_asign}>
                  <td>{a.id_asign}</td>
                  <td><strong>{a.descripcion}</strong></td>
                  <td>{a.is_active ? 'Activa' : 'Inactiva'}</td>
                  <td className="acciones-tabla">
                    <button onClick={() => eliminarAsignaturaId(a.id_asign)} style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Eliminar</button>
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