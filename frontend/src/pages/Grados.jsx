import { useState, useEffect } from 'react';
import { getGrados, createGrado, updateGrado, deleteGrado } from '../services/gradoService';

const OPCIONES_GRADO = [
  'Inicial A',
  'Inicial B',
  '1er Grado',
  '2do Grado',
  '3er Grado',
  '4to Grado',
  '5to Grado',
  '6to Grado'
];

export default function Grados() {
  const [grados, setGrados] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [formulario, setFormulario] = useState({
    descripcion: '1er Grado',
    is_active: true
  });

  useEffect(() => {
    cargarGrados();
  }, []);

  const cargarGrados = async () => {
    try {
      setCargando(true);
      const data = await getGrados();
      setGrados(data);
    } catch (error) {
      console.error(error);
      alert('Error al cargar grados.');
    } finally {
      setCargando(false);
    }
  };

  const abrirFormularioNuevo = () => {
    setEditandoId(null);
    setFormulario({ descripcion: '1er Grado', is_active: true });
    setMostrarForm(true);
  };

  const abrirFormularioEditar = (grado) => {
    setEditandoId(grado.id_grad);
    setFormulario({
      descripcion: grado.descripcion,
      is_active: grado.is_active
    });
    setMostrarForm(true);
  };

  const cancelarFormulario = () => {
    setMostrarForm(false);
    setEditandoId(null);
    setFormulario({ descripcion: '1er Grado', is_active: true });
  };

  const guardarGrado = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await updateGrado(editandoId, {
          descripcion: formulario.descripcion,
          is_active: formulario.is_active
        });
        alert('¡Grado actualizado con éxito!');
      } else {
        await createGrado({ descripcion: formulario.descripcion });
        alert('¡Grado registrado con éxito!');
      }
      cancelarFormulario();
      cargarGrados();
    } catch (error) {
      console.error(error);
      alert(
        'Error al guardar el grado: ' +
          JSON.stringify(error.response?.data?.detail || error.message)
      );
    }
  };

  const eliminarGradoId = async (id) => {
    if (window.confirm('¿Eliminar este grado?')) {
      try {
        await deleteGrado(id);
        cargarGrados();
      } catch (error) {
        console.error(error);
        alert('No se pudo eliminar.');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Gestión de Grados Académicos</h1>
        <button
          className="boton-primario"
          onClick={() => (mostrarForm ? cancelarFormulario() : abrirFormularioNuevo())}
        >
          {mostrarForm ? 'Cancelar' : '+ Nuevo Grado'}
        </button>
      </div>

      {mostrarForm && (
        <div className="tarjeta" style={{ marginBottom: '20px' }}>
          <h3>{editandoId ? 'Editar Grado' : 'Registrar Grado'}</h3>
          <form onSubmit={guardarGrado}>
            <div className="campo-formulario">
              <label>Nivel de Grado</label>
              <select
                value={formulario.descripcion}
                onChange={(e) =>
                  setFormulario({ ...formulario, descripcion: e.target.value })
                }
              >
                {OPCIONES_GRADO.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
            </div>

            {editandoId && (
              <div className="campo-formulario" style={{ marginTop: '10px' }}>
                <label>Estado</label>
                <select
                  value={formulario.is_active ? 'true' : 'false'}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      is_active: e.target.value === 'true'
                    })
                  }
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
            )}

            <button type="submit" className="boton-primario" style={{ marginTop: '10px' }}>
              {editandoId ? 'Actualizar Grado' : 'Guardar'}
            </button>
          </form>
        </div>
      )}

      <div className="tarjeta">
        <h3>Grados Registrados ({grados.length})</h3>
        {cargando ? (
          <p>Cargando...</p>
        ) : (
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
              {grados.map((g) => (
                <tr key={g.id_grad}>
                  <td>{g.id_grad}</td>
                  <td>
                    <strong>{g.descripcion}</strong>
                  </td>
                  <td>{g.is_active ? 'Activo' : 'Inactivo'}</td>
                  <td className="acciones-tabla" style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => abrirFormularioEditar(g)}
                      style={{
                        background: '#3182ce',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarGradoId(g.id_grad)}
                      style={{
                        background: '#e53e3e',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer'
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