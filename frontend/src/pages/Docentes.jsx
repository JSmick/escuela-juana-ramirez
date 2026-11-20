import { useState, useEffect } from 'react';
import { getDocentes, createDocente, deleteDocente } from '../services/docenteService';

export default function Docentes() {
  const [docentes, setDocentes] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [cargando, setCargando] = useState(false);

  const [formulario, setFormulario] = useState({
    nom: '',
    apell: '',
    cedula: '',
    telef: '',
    email: '',
    direccion: '',
    titulo_academico: '',
    password_temporal: ''
  });

  useEffect(() => {
    cargarDocentes();
  }, []);

  const cargarDocentes = async () => {
    try {
      setCargando(true);
      const data = await getDocentes();
      setDocentes(data);
    } catch (error) {
      console.error(error);
      alert('Error al cargar los docentes.');
    } finally {
      setCargando(false);
    }
  };

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const guardarDocente = async (e) => {
    e.preventDefault();
    try {
      await createDocente(formulario);
      alert('¡Docente registrado con éxito y usuario creado!');
      setFormulario({
        nom: '', apell: '', cedula: '', telef: '', email: '', direccion: '', titulo_academico: '', password_temporal: ''
      });
      setMostrarForm(false);
      cargarDocentes();
    } catch (error) {
      console.error(error);
      alert('Error al registrar el docente. Revisa los datos.');
    }
  };

  const eliminarDocenteId = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este docente?')) {
      try {
        await deleteDocente(id);
        cargarDocentes();
      } catch (error) {
        console.error(error);
        alert('No se pudo eliminar el docente.');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Gestión de Docentes</h1>
        <button className="boton-primario" onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? 'Cancelar' : '+ Nuevo Docente'}
        </button>
      </div>

      {mostrarForm && (
        <div className="tarjeta" style={{ marginBottom: '20px' }}>
          <h3>Registrar Nuevo Docente</h3>
          <form onSubmit={guardarDocente}>
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
                <label>Cédula</label>
                <input type="text" name="cedula" value={formulario.cedula} onChange={manejarCambio} required />
              </div>
              <div className="campo-formulario">
                <label>Teléfono</label>
                <input type="text" name="telef" value={formulario.telef} onChange={manejarCambio} />
              </div>
              <div className="campo-formulario">
                <label>Correo Electrónico</label>
                <input type="email" name="email" value={formulario.email} onChange={manejarCambio} />
              </div>
              <div className="campo-formulario">
                <label>Título Académico</label>
                <input type="text" name="titulo_academico" value={formulario.titulo_academico} onChange={manejarCambio} required />
              </div>
              <div className="campo-formulario">
                <label>Dirección</label>
                <input type="text" name="direccion" value={formulario.direccion} onChange={manejarCambio} />
              </div>
              <div className="campo-formulario">
                <label>Contraseña Temporal (Usuario)</label>
                <input type="password" name="password_temporal" value={formulario.password_temporal} onChange={manejarCambio} required />
              </div>
            </div>
            <button type="submit" className="boton-primario" style={{ marginTop: '20px' }}>Guardar Docente</button>
          </form>
        </div>
      )}

      <div className="tarjeta">
        <h3>Docentes Registrados ({docentes.length})</h3>
        {cargando ? <p>Cargando...</p> : (
          <table className="tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre y Apellido</th>
                <th>Cédula</th>
                <th>Título</th>
                <th>Correo</th>
                <th>Estado</th>
                <th className="acciones-tabla">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {docentes.map(d => (
                <tr key={d.id_docen}>
                  <td>{d.id_docen}</td>
                  <td><strong>{d.nom} {d.apell}</strong></td>
                  <td>{d.cedula}</td>
                  <td>{d.titulo_academico}</td>
                  <td>{d.email || 'N/A'}</td>
                  <td>{d.is_active ? 'Activo' : 'Inactivo'}</td>
                  <td className="acciones-tabla">
                    <button onClick={() => eliminarDocenteId(d.cedula)} style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Eliminar</button>
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