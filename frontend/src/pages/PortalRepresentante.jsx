import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export default function PortalRepresentante() {
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);

  // Formulario para crear/editar los datos del representante
  const [formRepresentante, setFormRepresentante] = useState({
    nom: '',
    apell: '',
    cedula: '',
    telef: '',
    email: '',
    direccion: '',
    parentesco: 'Madre'
  });

  // Cargar el perfil del representante al iniciar
  const cargarPerfil = async () => {
    try {
      setCargando(true);
      const response = await axiosClient.get('/representantes/mi-perfil');
      setPerfil(response.data);
      setFormRepresentante({
        nom: response.data.nom || '',
        apell: response.data.apell || '',
        cedula: response.data.cedula || '',
        telef: response.data.telef || '',
        email: response.data.email || '',
        direccion: response.data.direccion || '',
        parentesco: response.data.parentesco || 'Madre'
      });
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        setPerfil(null); // No tiene perfil creado aún
      } else {
        setError('Error al cargar la información del representante.');
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  const manejarCambio = (e) => {
    setFormRepresentante({ ...formRepresentante, [e.target.name]: e.target.value });
  };

  const guardarPerfil = async (e) => {
    e.preventDefault();
    try {
      // Obtenemos el ID del usuario actual desde el token JWT
      const token = localStorage.getItem('access_token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const id_user = Number(payload.sub);

      const datosEnviar = { ...formRepresentante, id_user };

      if (perfil) {
        // Actualizar
        await axiosClient.put(`/representantes/${perfil.id_represen}`, datosEnviar);
        alert('¡Perfil actualizado con éxito!');
      } else {
        // Crear
        await axiosClient.post('/representantes', datosEnviar);
        alert('¡Perfil de representante creado con éxito!');
      }
      setModoEdicion(false);
      cargarPerfil();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || 'Error al guardar el perfil.');
    }
  };

  if (cargando) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando portal...</div>;

  return (
    <div style={{ padding: '30px' }}>
      
      {/* SECCIÓN 1: DATOS DEL REPRESENTANTE */}
      <div className="tarjeta" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ color: '#1e3a5f', margin: 0 }}>Mi Perfil de Representante</h2>
          {perfil && !modoEdicion && (
            <button className="boton-primario" onClick={() => setModoEdicion(true)} style={{ padding: '8px 15px' }}>
              Editar Mis Datos
            </button>
          )}
        </div>

        {error && <div style={{ backgroundColor: '#fed7d7', color: '#9b2c2c', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{error}</div>}

        {!perfil || modoEdicion ? (
          <form onSubmit={guardarPerfil}>
            <p style={{ color: '#718096', marginBottom: '20px', fontSize: '14px' }}>
              {perfil ? 'Actualice sus datos personales:' : 'Por favor, complete sus datos personales para poder registrar estudiantes:'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="campo-formulario">
                <label>Nombres</label>
                <input name="nom" value={formRepresentante.nom} onChange={manejarCambio} required />
              </div>
              <div className="campo-formulario">
                <label>Apellidos</label>
                <input name="apell" value={formRepresentante.apell} onChange={manejarCambio} required />
              </div>
              <div className="campo-formulario">
                <label>Cédula de Identidad</label>
                <input name="cedula" value={formRepresentante.cedula} onChange={manejarCambio} required />
              </div>
              <div className="campo-formulario">
                <label>Teléfono</label>
                <input name="telef" value={formRepresentante.telef} onChange={manejarCambio} />
              </div>
              <div className="campo-formulario">
                <label>Correo Electrónico</label>
                <input type="email" name="email" value={formRepresentante.email} onChange={manejarCambio} />
              </div>
              <div className="campo-formulario">
                <label>Parentesco</label>
                <select name="parentesco" value={formRepresentante.parentesco} onChange={manejarCambio}>
                  <option value="Madre">Madre</option>
                  <option value="Padre">Padre</option>
                  <option value="Representante legal"> Representante Legal</option>
                  <option value="Otros ">  Otros</option>

                </select>
              </div>
            </div>
            <div className="campo-formulario">
              <label>Dirección</label>
              <input name="direccion" value={formRepresentante.direccion} onChange={manejarCambio} />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button type="submit" className="boton-primario">Guardar Datos</button>
              {perfil && (
                <button type="button" onClick={() => setModoEdicion(false)} style={{ backgroundColor: '#a0aec0', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', color: '#4a5568' }}>
            <p style={{ textTransform: 'capitalize'}}><strong>Nombre:</strong> {perfil.nom} {perfil.apell}</p>
            <p><strong>Cédula:</strong> {perfil.cedula}</p>
            <p><strong>Teléfono:</strong> {perfil.telef || 'No registrado'}</p>
            <p><strong>Correo:</strong> {perfil.email || 'No registrado'}</p>
            <p style={{ textTransform: 'capitalize'}}><strong>Parentesco:</strong> {perfil.parentesco}</p>
            <p style={{ textTransform: 'capitalize'}}><strong>Dirección:</strong> {perfil.direccion || 'No registrada'}</p>
          </div>
        )}
      </div>

      {/* SECCIÓN 2: TARJETAS DE ESTUDIANTES REPRESENTADOS */}
      <div>
        <h3 style={{ color: '#1e3a5f', marginBottom: '15px' }}>Mis Estudiantes Registrados ({perfil?.estudiantes?.length || 0})</h3>
        
        {!perfil ? (
          <div className="tarjeta" style={{ textAlign: 'center', color: '#718096' }}>
            <p>Debe registrar sus datos personales arriba para poder ver y registrar a sus estudiantes.</p>
          </div>
        ) : perfil.estudiantes.length === 0 ? (
          <div className="tarjeta" style={{ textAlign: 'center', color: '#718096', padding: '30px' }}>
            <p>No tiene estudiantes registrados todavía. Vaya a <strong>"Registrar Estudiante"</strong> en el menú lateral para agregar uno.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {perfil.estudiantes.map((est) => (

              <div key={est.id_studs} className="tarjeta" style={{ borderTop: '4px solid #2b6cb0', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: est.is_active ? '#c6f6d5' : '#fed7d7', color: est.is_active ? '#22543d' : '#9b2c2c', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                  {est.is_active ? 'Activo' : 'Inactivo'}
                </span>

                <h4 style={{ color: '#1e3a5f', marginBottom: '10px', fontSize: '18px', textTransform:'capitalize' }}>{est.apell}, {est.nom}</h4>
                
                <div style={{ fontSize: '14px', color: '#4a5568', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <p><strong>Nacimiento:</strong> {est.fecha_nac}</p>

                  <p style={{ textTransform: 'capitalize'}}> <strong>Género:</strong> {est.genero || 'No especificado'}</p>

                  <p><strong>Cédula Escolar:</strong> {est.cedula_esco_cedula || <span style={{ color: '#e53e3e' }}>Pendiente por asignar </span>}</p>

                  <p style={{ textTransform: 'capitalize'}}> <strong>Obs. Médicas:</strong> {est.observaciones_med || 'Ninguna'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}