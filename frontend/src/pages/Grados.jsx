import { useState, useEffect } from 'react';
import { getGrados, createGrado, deleteGrado } from '../services/gradoService';

export default function Grados() {
  const [grados, setGrados] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [descripcion, setDescripcion] = useState('1er Grado');
  const [cargando, setCargando] = useState(false);

  useEffect(() => { cargarGrados(); }, []);

  const cargarGrados = async () => {
    try {
      setCargando(true);
      const data = await getGrados();
      setGrados(data);
    } catch (error) {
      console.error(error);
      alert('Error al cargar grados.');
    } finally { setCargando(false); }
  };

  const guardarGrado = async (e) => {
    e.preventDefault();
    try {
      await createGrado({ descripcion });
      alert('¡Grado registrado con éxito!');
      setMostrarForm(false);
      cargarGrados();
    } catch (error) {
      console.error(error);
      alert('Error al guardar el grado.');
    }
  };

  const eliminarGradoId = async (id) => {
    if (window.confirm('¿Eliminar este grado?')) {
      try {
        await deleteGrado(id);
        cargarGrados();
      } catch (error) { console.error(error); alert('No se pudo eliminar.'); }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Gestión de Grados Académicos</h1>
        <button className="boton-primario" onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? 'Cancelar' : '+ Nuevo Grado'}
        </button>
      </div>

      {mostrarForm && (
        <div className="tarjeta" style={{ marginBottom: '20px' }}>
          <h3>Registrar Grado</h3>
          <form onSubmit={guardarGrado}>
            <div className="campo-formulario">
              <label>Nivel de Grado</label>
              <select value={descripcion} onChange={(e) => setDescripcion(e.target.value)}>
                <option value="Inicial A">Inicial A</option>
                <option value="Inicial B">Inicial B</option>
                <option value="1er Grado">1er Grado</option>
                <option value="2do Grado">2do Grado</option>
                <option value="3er Grado">3er Grado</option>
                <option value="4to Grado">4to Grado</option>
                <option value="5to Grado">5to Grado</option>
                <option value="6to Grado">6to Grado</option>
              </select>
            </div>
            <button type="submit" className="boton-primario" style={{ marginTop: '10px' }}>Guardar</button>
          </form>
        </div>
      )}

      <div className="tarjeta">
        <h3>Grados Registrados ({grados.length})</h3>
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
              {grados.map(g => (
                <tr key={g.id_grad}>
                  <td>{g.id_grad}</td>
                  <td><strong>{g.descripcion}</strong></td>
                  <td>{g.is_active ? 'Activo' : 'Inactivo'}</td>
                  <td className="acciones-tabla">
                    <button onClick={() => eliminarGradoId(g.id_grad)} style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Eliminar</button>
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