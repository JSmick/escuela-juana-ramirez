import { useState, useEffect } from 'react';
import { getTurnos, createTurno, deleteTurno } from '../services/turnoService';

export default function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarTurnos();
  }, []);

  const cargarTurnos = async () => {
    try {
      setCargando(true);
      const data = await getTurnos();
      setTurnos(data);
    } catch (error) {
      console.error(error);
      alert('Error al cargar los turnos.');
    } finally {
      setCargando(false);
    }
  };

  const guardarTurno = async (e) => {
    e.preventDefault();
    try {
      await createTurno({ descripcion });
      alert('¡Turno registrado con éxito!');
      setDescripcion('');
      setMostrarForm(false);
      cargarTurnos();
    } catch (error) {
      console.error(error);
      alert('Error al guardar el turno.');
    }
  };

  const eliminarTurnoId = async (id) => {
    if (window.confirm('¿Desea eliminar este turno?')) {
      try {
        await deleteTurno(id);
        cargarTurnos();
      } catch (error) {
        console.error(error);
        alert('No se pudo eliminar el turno.');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Gestión de Turnos (Exclusivo Administrador)</h1>
        <button className="boton-primario" onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? 'Cancelar' : '+ Nuevo Turno'}
        </button>
      </div>

      {mostrarForm && (
        <div className="tarjeta" style={{ marginBottom: '20px' }}>
          <h3>Registrar Turno</h3>
          <form onSubmit={guardarTurno}>
            <div className="campo-formulario">
              <label>Descripción (Ej: Mañana, Tarde)</label>
              <input 
                type="text" 
                value={descripcion} 
                onChange={(e) => setDescripcion(e.target.value)} 
                maxLength={50} 
                required 
              />
            </div>
            <button type="submit" className="boton-primario" style={{ marginTop: '10px' }}>
              Guardar Turno
            </button>
          </form>
        </div>
      )}

      <div className="tarjeta">
        <h3>Turnos Registrados ({turnos.length})</h3>
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
              {turnos.map(t => (
                <tr key={t.id_turno}>
                  <td>{t.id_turno}</td>
                  <td><strong>{t.descripcion}</strong></td>
                  <td>{t.is_active ? 'Activo' : 'Inactivo'}</td>
                  <td className="acciones-tabla">
                    <button onClick={() => eliminarTurnoId(t.id_turno)} style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
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