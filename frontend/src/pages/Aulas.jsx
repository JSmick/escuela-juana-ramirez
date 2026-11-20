import { useState, useEffect } from 'react';
import { getAulas, createAula, deleteAula } from '../services/aulaService';

export default function Aulas() {
  const [aulas, setAulas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(false);

  const [formulario, setFormulario] = useState({
    descripcion: ''
  });

  useEffect(() => {
    cargarAulasDesdeAPI();
  }, []);

  const cargarAulasDesdeAPI = async () => {
    try {
      setCargando(true);
      const data = await getAulas();
      setAulas(data);
    } catch (error) {
      console.error("Error al cargar aulas:", error);
      alert("No se pudieron cargar las aulas del servidor.");
    } finally {
      setCargando(false);
    }
  };

  const manejarCambio = (e) => setFormulario({ ...formulario, [e.target.name]: e.target.value });

  const guardarAula = async (e) => {
    e.preventDefault();
    try {
      await createAula(formulario);
      alert('¡Aula registrada con éxito!');
      setFormulario({ descripcion: '' });
      setMostrarFormulario(false);
      cargarAulasDesdeAPI();
    } catch (error) {
      console.error(error);
      alert('Error al guardar el aula. Verifica los datos.');
    }
  };

  const eliminarAulaId = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta aula?')) {
      try {
        await deleteAula(id);
        cargarAulasDesdeAPI();
      } catch (error) {
        console.error(error);
        alert('No se pudo eliminar el aula.');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Gestión de Aulas</h1>
        <button className="boton-primario" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
          {mostrarFormulario ? 'Cancelar' : '+ Nueva Aula'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="tarjeta" style={{ marginBottom: '20px' }}>
          <h3>Registrar Nueva Aula</h3>
          <form onSubmit={guardarAula}>
            <div className="campo-formulario">
              <label>Nombre / Descripción del Aula (Ej: Aula 1, Salón B)</label>
              <input 
                name="descripcion" 
                value={formulario.descripcion} 
                onChange={manejarCambio} 
                maxLength={50} 
                required 
              />
            </div>
            <button type="submit" className="boton-primario" style={{ marginTop: '15px' }}>
              Guardar Aula
            </button>
          </form>
        </div>
      )}

      <div className="tarjeta">
        <h3>Aulas Registradas ({aulas.length})</h3>
        {cargando ? <p>Cargando datos...</p> : (
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
              {aulas.map(aula => (
                <tr key={aula.id_aula}>
                  <td>{aula.id_aula}</td>
                  <td><strong>{aula.descripcion}</strong></td>
                  <td>{aula.is_active ? 'Activa' : 'Inactiva'}</td>
                  <td className="acciones-tabla">
                    <button onClick={() => eliminarAulaId(aula.id_aula)} style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
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