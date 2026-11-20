import { useState, useEffect } from 'react';
import { getAnosEscolares, createAnoEscolar, deleteAnoEscolar } from '../services/anoEscolarService';

export default function AnoEscolar() {
  const [anos, setAnos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [cargando, setCargando] = useState(false);

  const [formulario, setFormulario] = useState({
    nombre: '',
    fecha_inicio: '',
    fecha_fin: '',
    es_actual: false
  });

  useEffect(() => {
    cargarAnos();
  }, []);

  const cargarAnos = async () => {
    try {
      setCargando(true);
      const data = await getAnosEscolares();
      setAnos(data);
    } catch (error) {
      console.error(error);
      alert('Error al cargar los años escolares.');
    } finally {
      setCargando(false);
    }
  };

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const guardarAnoEscolar = async (e) => {
    e.preventDefault();
    try {
      // Envía los datos exactos que espera AnoEscolarCreate en FastAPI
      await createAnoEscolar(formulario);
      alert('¡Año escolar registrado con éxito!');
      setFormulario({ nombre: '', fecha_inicio: '', fecha_fin: '', es_actual: false });
      setMostrarForm(false);
      cargarAnos();
    } catch (error) {
      console.error(error);
      alert('Error al guardar el año escolar. Revisa los datos.');
    }
  };

  const eliminarAnoId = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este período académico?')) {
      try {
        await deleteAnoEscolar(id);
        cargarAnos();
      } catch (error) {
        console.error(error);
        alert('No se pudo eliminar el año escolar.');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Gestión de Años Escolares (Exclusivo Administrador)</h1>
        <button className="boton-primario" onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? 'Cancelar' : '+ Nuevo Año Escolar'}
        </button>
      </div>

      {mostrarForm && (
        <div className="tarjeta" style={{ marginBottom: '20px' }}>
          <h3>Registrar Período Académico</h3>
          <form onSubmit={guardarAnoEscolar}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <div className="campo-formulario">
                <label>Nombre (Ej:regreso 2024-2025)</label>
                <input 
                  type="text" 
                  name="nombre" 
                  value={formulario.nombre} 
                  onChange={manejarCambio} 
                  maxLength={20} 
                  placeholder="regreso 2024-2025"
                  required 
                />
              </div>
              <div className="campo-formulario">
                <label>Fecha de Inicio</label>
                <input 
                  type="date" 
                  name="fecha_inicio" 
                  value={formulario.fecha_inicio} 
                  onChange={manejarCambio} 
                  required 
                />
              </div>
              <div className="campo-formulario">
                <label>Fecha de Cierre</label>
                <input 
                  type="date" 
                  name="fecha_fin" 
                  value={formulario.fecha_fin} 
                  onChange={manejarCambio} 
                  required 
                />
              </div>
            </div>

            <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input 
                type="checkbox" 
                id="es_actual" 
                name="es_actual" 
                checked={formulario.es_actual} 
                onChange={manejarCambio} 
              />
              <label htmlFor="es_actual" style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Marcar como Período Académico Activo / Actual
              </label>
            </div>

            <button type="submit" className="boton-primario" style={{ marginTop: '20px' }}>
              Guardar Año Escolar
            </button>
          </form>
        </div>
      )}

      <div className="tarjeta">
        <h3>Períodos Registrados ({anos.length})</h3>
        {cargando ? <p>Cargando...</p> : (
          <table className="tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Inicio</th>
                <th>Cierre</th>
                <th>Actual</th>
                <th>Estado</th>
                <th className="acciones-tabla">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {anos.map(a => (
                <tr key={a.id_ano}>
                  <td>{a.id_ano}</td>
                  <td><strong>{a.nombre}</strong></td>
                  <td>{a.fecha_inicio}</td>
                  <td>{a.fecha_fin}</td>
                  <td>
                    {a.es_actual ? (
                      <span style={{ backgroundColor: '#c6f6d5', color: '#22543d', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px' }}>
                        Activo (Actual)
                      </span>
                    ) : 'No'}
                  </td>
                  <td>{a.is_active ? 'Habilitado' : 'Inhabilitado'}</td>
                  <td className="acciones-tabla">
                    <button onClick={() => eliminarAnoId(a.id_ano)} style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
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