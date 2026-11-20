import { useState, useEffect } from 'react';
import { getInventarios, createInventario, updateInventario, deleteInventario } from '../services/inventarioService';

export default function Inventario() {
  const [bienes, setBienes] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [cargando, setCargando] = useState(false);

  const [formulario, setFormulario] = useState({
    codigo: '', 
    nombre_inv: '', 
    cantidad: 1, 
    estado_fisico: 'Bueno', 
    ubicacion: '', 
    observacion: ''
  });

  useEffect(() => {
    cargarInventario();
  }, []);

  const cargarInventario = async () => {
    try {
      setCargando(true);
      const data = await getInventarios();
      setBienes(data);
    } catch (error) {
      console.error("Error al cargar inventario:", error);
      alert("No se pudo cargar el inventario del servidor.");
    } finally {
      setCargando(false);
    }
  };

  const manejarCambio = (e) => setFormulario({ ...formulario, [e.target.name]: e.target.value });

  const guardarBien = async (e) => {
    e.preventDefault();
    if (!formulario.codigo || !formulario.nombre_inv) {
      return alert('El código y el nombre del bien son obligatorios');
    }

    try {
      if (editandoId) {
        await updateInventario(editandoId, formulario);
        alert('¡Bien actualizado con éxito!');
      } else {
        await createInventario(formulario);
        alert('¡Bien registrado con éxito!');
      }
      
      limpiarFormulario();
      cargarInventario();
    } catch (error) {
      console.error(error);
      alert('Error al guardar el bien en el servidor. Verifica los datos.');
    }
  };

  const prepararEdicion = (bien) => {
    setFormulario({
      codigo: bien.codigo,
      nombre_inv: bien.nombre_inv,
      cantidad: bien.cantidad,
      estado_fisico: bien.estado_fisico,
      ubicacion: bien.ubicacion || '',
      observacion: bien.observacion || ''
    });
    setEditandoId(bien.id_inv);
    setMostrarFormulario(true);
  };

  const eliminarBienId = async (id) => {
    if (window.confirm('¿Está seguro de eliminar o inactivar este bien del inventario?')) {
      try {
        await deleteInventario(id);
        cargarInventario();
      } catch (error) {
        console.error(error);
        alert('No se pudo eliminar el artículo.');
      }
    }
  };

  const limpiarFormulario = () => {
    setFormulario({ codigo: '', nombre_inv: '', cantidad: 1, estado_fisico: 'Bueno', ubicacion: '', observacion: '' });
    setMostrarFormulario(false);
    setEditandoId(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Inventario de Bienes Públicos</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => window.print()} style={{ background: '#4a5568', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
            🖨️ Imprimir Inventario
          </button>
          <button className="boton-primario" onClick={() => {
            if(mostrarFormulario) limpiarFormulario();
            else setMostrarFormulario(true);
          }}>
            {mostrarFormulario ? 'Cancelar' : '+ Nuevo Bien'}
          </button>
        </div>
      </div>

      {mostrarFormulario && (
        <div className="tarjeta" style={{ marginBottom: '20px', border: editandoId ? '2px solid #ecc94b' : 'none' }}>
          <h3>{editandoId ? '✏️ Editando Bien' : 'Registrar Nuevo Bien'}</h3>
          <form onSubmit={guardarBien}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="campo-formulario">
                <label>Código / Serial</label>
                <input name="codigo" value={formulario.codigo} onChange={manejarCambio} required />
              </div>
              <div className="campo-formulario">
                <label>Nombre del Bien</label>
                <input name="nombre_inv" value={formulario.nombre_inv} onChange={manejarCambio} placeholder="Ej: Computadora, Silla..." required />
              </div>
              <div className="campo-formulario">
                <label>Cantidad</label>
                <input type="number" min="1" name="cantidad" value={formulario.cantidad} onChange={manejarCambio} required />
              </div>
              <div className="campo-formulario">
                <label>Estado Físico</label>
                <select name="estado_fisico" value={formulario.estado_fisico} onChange={manejarCambio}>
                  <option value="Bueno">Bueno</option>
                  <option value="Regular">Regular</option>
                  <option value="Malo">Malo</option>
                </select>
              </div>
              <div className="campo-formulario">
                <label>Ubicación</label>
                <input name="ubicacion" value={formulario.ubicacion} onChange={manejarCambio} placeholder="Ej: Dirección, Aula 1..." />
              </div>
              <div className="campo-formulario">
                <label>Observaciones</label>
                <input name="observacion" value={formulario.observacion} onChange={manejarCambio} />
              </div>
            </div>
            <button type="submit" className="boton-primario" style={{ marginTop: '15px', backgroundColor: editandoId ? '#ecc94b' : '' }}>
              {editandoId ? 'Actualizar Bien' : 'Guardar Bien'}
            </button>
          </form>
        </div>
      )}

      <div className="tarjeta">
        <h3>Lista de Bienes ({bienes.length})</h3>
        {cargando ? <p>Cargando inventario...</p> : (
          <table className="tabla">
            <thead>
              <tr>
                <th>Código</th>
                <th>Bien</th>
                <th>Cant.</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th className="acciones-tabla">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {bienes.map(bien => (
                <tr key={bien.id_inv}>
                  <td>{bien.codigo}</td>
                  <td>{bien.nombre_inv} <br/><small style={{color: '#718096'}}>{bien.observacion}</small></td>
                  <td>{bien.cantidad}</td>
                  <td>{bien.ubicacion || 'N/A'}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', 
                      backgroundColor: bien.estado_fisico === 'Bueno' ? '#c6f6d5' : (bien.estado_fisico === 'Regular' ? '#feebc8' : '#fed7d7'),
                      color: bien.estado_fisico === 'Bueno' ? '#276749' : (bien.estado_fisico === 'Regular' ? '#c05621' : '#9b2c2c')
                    }}>
                      {bien.estado_fisico}
                    </span>
                  </td>
                  <td className="acciones-tabla">
                    <button onClick={() => prepararEdicion(bien)} style={{ background: '#4299e1', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Editar</button>
                    <button onClick={() => eliminarBienId(bien.id_inv)} style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Eliminar</button>
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