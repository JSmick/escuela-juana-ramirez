import { useState, useEffect } from 'react';
import { getEventos, createEvento, updateEvento, deleteEvento } from '../services/eventoService';
import { getGrados } from '../services/gradoService';

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [grados, setGrados] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [errorCarga, setErrorCarga] = useState(null);
  const [formulario, setFormulario] = useState({
    titulo: '',
    fecha: '',
    tipo: 'Efemérides',
    descripcion: '',
    lugar: 'Instalaciones de la Escuela',
    hora_inicio: '',
    hora_fin: '',
    id_grado: ''
  });

  const cargarDatos = async () => {
    try {
      const [resEventos, resGrados] = await Promise.all([
        getEventos(),
        getGrados()
      ]);

      

      setGrados(resGrados.data || resGrados);

      const eventosFormateados = resEventos.map(ev => ({
        id: ev.id_evento,
        titulo: ev.titulo_evento,
        fecha: ev.fecha_even ? ev.fecha_even.split('T')[0] : '',
        tipo: ev.tipo_evento,
        descripcion: ev.detalles_even || '',
        lugar: ev.lugar_even || 'Instalaciones de la Escuela',
        hora_inicio: ev.hora_inicio || '',
        hora_fin: ev.hora_fin || '',
        id_grado: ev.id_grado || ''
      }));
      setEventos(eventosFormateados);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setErrorCarga('No se pudieron cargar los datos. Verifique su conexión o permisos.');
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const manejarCambio = (e) => setFormulario({ ...formulario, [e.target.name]: e.target.value });

  const guardarEvento = async (e) => {
    e.preventDefault();
    if (!formulario.titulo || !formulario.fecha || !formulario.id_grado) {
      return alert('El título, la fecha y el grado son obligatorios');
    }

    const payload = {
      titulo_evento: formulario.titulo,
      fecha_even: formulario.fecha,
      tipo_evento: formulario.tipo,
      detalles_even: formulario.descripcion,
      lugar_even: formulario.lugar,
      hora_inicio: formulario.hora_inicio ? (formulario.hora_inicio.length === 5 ? formulario.hora_inicio + ':00' : formulario.hora_inicio) : null,
      hora_fin: formulario.hora_fin ? (formulario.hora_fin.length === 5 ? formulario.hora_fin + ':00' : formulario.hora_fin) : null,
      id_grado: parseInt(formulario.id_grado),
      is_active: true
    };

    try {
      if (editandoId) {
        await updateEvento(editandoId, payload);
      } else {
        await createEvento(payload);
      }
      await cargarDatos();
      limpiarFormulario();
    } catch (error) {
      console.error('Error al guardar el evento:', error);
      alert('Hubo un error al guardar el evento en la base de datos. Revisa los campos.');
    }
  };

  const prepararEdicion = (evento) => {
    setFormulario({
      titulo: evento.titulo,
      fecha: evento.fecha,
      tipo: evento.tipo,
      descripcion: evento.descripcion,
      lugar: evento.lugar,
      hora_inicio: evento.hora_inicio ? evento.hora_inicio.slice(0, 5) : '',
      hora_fin: evento.hora_fin ? evento.hora_fin.slice(0, 5) : '',
      id_grado: evento.id_grado || ''
    });
    setEditandoId(evento.id);
    setMostrarFormulario(true);
  };

  const eliminarEvento = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este evento de la cartelera?')) {
      try {
        await deleteEvento(id);
        await cargarDatos();
      } catch (error) {
        console.error('Error al eliminar evento:', error);
        alert('No se pudo eliminar el evento.');
      }
    }
  };

  const limpiarFormulario = () => {
    setFormulario({
      titulo: '',
      fecha: '',
      tipo: 'Efemérides',
      descripcion: '',
      lugar: 'Instalaciones de la Escuela',
      hora_inicio: '',
      hora_fin: '',
      id_grado: ''
    });
    setMostrarFormulario(false);
    setEditandoId(null);
  };

  const coloresTipo = {
    'Efemérides': '#805ad5',
    'Feria Expo': '#dd6b20',
    'Cultural': '#d53f8c',
    'Reunión': '#3182ce',
    'Otro': '#718096'
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1>Cartelera de Eventos</h1>
          <p style={{ color: '#718096', marginTop: '5px', textTransform: 'capitalize' }}>Gestión de efemérides, ferias, juegos deportivos y actividades culturales.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          
          {/* Solo se muestra si el rol en localStorage es Admin */}
        {localStorage.getItem('sesion_juana')?.toLowerCase() === 'admin' && (
          <button className="boton-primario" onClick={() => {
            if(mostrarFormulario) limpiarFormulario();
            else setMostrarFormulario(true);
          }}>
            {mostrarFormulario ? 'Cancelar' : '+ Nuevo Evento'}
          </button>
        )}
        </div>
      </div>

      {mostrarFormulario && (
        <div className="tarjeta" style={{ border: editandoId ? '2px solid #ecc94b' : 'none' }}>
          <h3>{editandoId ? 'Editando Evento' : 'Registrar Nuevo Evento'}</h3>
          <form onSubmit={guardarEvento}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="campo-formulario" style={{ gridColumn: 'span 2' }}>
                <label>Título del Evento </label>
                <input name="titulo" value={formulario.titulo} onChange={manejarCambio} maxLength={100} placeholder="Ej: Día del padre" required />
              </div>
              <div className="campo-formulario">
                <label>Fecha </label>
                <input type="date" name="fecha" value={formulario.fecha} onChange={manejarCambio} required />
              </div>
              <div className="campo-formulario">
                <label>Tipo de Evento</label>
                <select name="tipo" value={formulario.tipo} onChange={manejarCambio}>
                  <option value="Efemérides">Efemérides</option>
                  <option value="Feria Expo">Feria Expo</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Reunión">Reunión</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="campo-formulario" style={{ gridColumn: 'span 2' }}>
                <label>Lugar</label>
                <input name="lugar" value={formulario.lugar} onChange={manejarCambio} maxLength={100} />
              </div>
              
              {/* Selector corregido con id_grad */}
              <div className="campo-formulario">
                <label>Grado al que va dirigido</label>
                <select name="id_grado" value={formulario.id_grado} onChange={manejarCambio} required>
                  <option value="">Seleccione un grado...</option>
                  {grados.map(g => (
                    <option key={g.id_grad} value={g.id_grad}>
                      {g.descripcion|| `Grado ${g.id_grad}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo-formulario">
                <label>Hora Inicio (Opcional)</label>
                <input type="time" name="hora_inicio" value={formulario.hora_inicio} onChange={manejarCambio} />
              </div>
              <div className="campo-formulario">
                <label>Hora Fin (Opcional)</label>
                <input type="time" name="hora_fin" value={formulario.hora_fin} onChange={manejarCambio} />
              </div>
            </div>
            <div className="campo-formulario">
              <label>Descripción</label>
              <textarea rows="2" name="descripcion" value={formulario.descripcion} onChange={manejarCambio} maxLength={100} placeholder="Detalles del evento..." />
            </div>
            <button type="submit" className="boton-primario" style={{ backgroundColor: editandoId ? '#ecc94b' : '' }}>
              {editandoId ? 'Actualizar Evento' : 'Publicar Evento'}
            </button>
          </form>
        </div>
      )}

      {/* CARTELERA VISUAL */}
      <div  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {eventos.length === 0 ? (
          <div className="tarjeta" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#a0aec0' }}>No hay eventos programados aún.</p>
          </div>
        ) : (
          [...eventos].sort((a,b) => new Date(a.fecha) - new Date(b.fecha)).map(ev => (
            <div key={ev.id} className="tarjeta" style={{ display: 'flex', flexDirection: 'column', borderTop: `5px solid ${coloresTipo[ev.tipo] || '#a0aec0'}` }}>
              <span style={{ 
                fontSize: '11px', fontWeight: 'bold', color: 'white', backgroundColor: coloresTipo[ev.tipo] || '#a0aec0', 
                padding: '3px 8px', borderRadius: '12px', alignSelf: 'flex-start', marginBottom: '10px' 
              }}>
                {ev.tipo.toUpperCase()}
              </span>
              
              <h3 style={{ color: '#1e3a5f', marginBottom: '5px', fontSize: '18px', textTransform: 'capitalize'}}>{ev.titulo}</h3>
              <p style={{ color: '#e53e3e', fontWeight: 'bold', fontSize: '14px', marginBottom: '10px', textTransform: 'capitalize' }}>
                 {new Date(ev.fecha + 'T00:00:00').toLocaleDateString('es-VE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                {(ev.hora_inicio || ev.hora_fin) && ` (${ev.hora_inicio?.slice(0,5) || ''}${ev.hora_fin ? ' - ' + ev.hora_fin.slice(0,5) : ''})`}
              </p>
              
              {ev.descripcion && <p style={{ fontSize: '14px', color: '#4a5568', marginBottom: '10px', flex: 1, textTransform: 'capitalize' }}>{ev.descripcion}</p>}
              
              <p style={{ fontSize: '12px', color: '#718096', borderTop: '1px solid #e2e8f0', paddingTop: '10px', textTransform: 'capitalize' }}>
                 {ev.lugar}
              </p>

              {/* Solo mostrar botones de modificar si es Admin */}
              {localStorage.getItem('sesion_juana')?.toLowerCase() === 'admin' && (
                <div style={{ display: 'flex', gap: '5px', marginTop: '15px' }}               className="acciones-tabla">
                 <button onClick={() => prepararEdicion(ev)} style={{ flex: 1, background:              '#4299e1', color: 'white', border: 'none', padding: '5px', borderRadius:            '4px', cursor: 'pointer', fontSize: '12px' }}>Editar</button>
                 <button onClick={() => eliminarEvento(ev.id)} style={{ flex: 1, background:              '#e53e3e', color: 'white', border: 'none', padding: '5px', borderRadius:            '4px', cursor: 'pointer', fontSize: '12px' }}>Eliminar</button>
               </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}