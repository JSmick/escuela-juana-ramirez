import { useState } from 'react';
import axiosClient from '../api/axiosClient';

export default function InscribirEstudiante({ irAInicio }) {
  const [formEstudiante, setFormEstudiante] = useState({
    nom: '',
    apell: '',
    fecha_nac: '',
    genero: 'Masculino',
    observaciones_med: ''
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const manejarCambio = (e) => {
    setFormEstudiante({ ...formEstudiante, [e.target.name]: e.target.value });
  };

  const enviarInscripcion = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      // Envía el JSON exacto al backend. El servicio en Python asigna el id_repre automáticamente usando el token JWT.
      await axiosClient.post('/estudiantes', formEstudiante);
      alert('¡Estudiante registrado e inscrito con éxito!');
      irAInicio(); // Regresa al inicio para ver las tarjetas
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Error al registrar el estudiante. Verifique que haya llenado sus datos de representante primero.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '700px', margin: '0 auto' }}>
      <div className="tarjeta">
        <h2 style={{ color: '#1e3a5f', marginBottom: '5px' }}>Registro de Nuevo Estudiante</h2>
        <p style={{ color: '#718096', marginBottom: '25px', fontSize: '14px' }}>Complete los datos del alumno a registrar.</p>

        {error && <div style={{ backgroundColor: '#fed7d7', color: '#9b2c2c', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}

        <form onSubmit={enviarInscripcion}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="campo-formulario">
              <label>Nombre(s) *</label>
              <input name="nom" value={formEstudiante.nom} onChange={manejarCambio} required />
            </div>
            <div className="campo-formulario">
              <label>Apellido(s) *</label>
              <input name="apell" value={formEstudiante.apell} onChange={manejarCambio} required />
            </div>
            <div className="campo-formulario">
              <label>Fecha de Nacimiento *</label>
              <input type="date" name="fecha_nac" value={formEstudiante.fecha_nac} onChange={manejarCambio} required />
            </div>
            <div className="campo-formulario">
              <label>Género *</label>
              <select name="genero" value={formEstudiante.genero} onChange={manejarCambio}>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>
          </div>

          <div className="campo-formulario">
            <label>Observaciones Médicas (Opcional)</label>
            <input name="observaciones_med" placeholder="Ej: Alérgico a la penicilina, asmático..." value={formEstudiante.observaciones_med} onChange={manejarCambio} />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" className="boton-primario" disabled={cargando} style={{ flex: 1 }}>
              {cargando ? 'Registrando...' : 'Guardar e Inscribir Estudiante'}
            </button>
            <button type="button" onClick={irAInicio} style={{ flex: 1, backgroundColor: '#a0aec0', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}