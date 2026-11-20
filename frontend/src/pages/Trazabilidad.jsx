import { useState, useEffect } from 'react';

export default function Trazabilidad() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [formulario, setFormulario] = useState({
    estudianteId: '', tipoEvento: 'Inscripción', descripcion: '', fecha: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const est = JSON.parse(localStorage.getItem('estudiantes_juana_ramirez') || '[]');
    const reg = JSON.parse(localStorage.getItem('trazabilidad_juana_ramirez') || '[]');
    setEstudiantes(est);
    setRegistros(reg);
  }, []);

  useEffect(() => {
    localStorage.setItem('trazabilidad_juana_ramirez', JSON.stringify(registros));
  }, [registros]);

  const guardarEvento = (e) => {
    e.preventDefault();
    if (!formulario.estudianteId || !formulario.descripcion) return alert('Seleccione un alumno y escriba una descripción');
    
    const alumno = estudiantes.find(est => est.id === Number(formulario.estudianteId));
    const nuevo = {
      ...formulario,
      id: Date.now(),
      estudianteNombre: alumno ? `${alumno.nombre} ${alumno.apellido}` : 'Desconocido'
    };
    setRegistros([nuevo, ...registros]);
    setFormulario({ ...formulario, descripcion: '' });

      const eliminarRegistro = (id) => {
    if (window.confirm('¿Está seguro de eliminar este registro del historial?')) {
      setRegistros(registros.filter(reg => reg.id !== id));
    }
  };
  };

  return (
    <div>
      <h1>Trazabilidad Académica</h1>
      <p style={{ color: '#718096', marginBottom: '20px' }}>Historial de vida del estudiante en la institución.</p>

      <div className="tarjeta">
        <h3>Registrar Nuevo Evento</h3>
        <form onSubmit={guardarEvento}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="campo-formulario">
              <label>Estudiante</label>
              <select name="estudianteId" value={formulario.estudianteId} onChange={(e) => setFormulario({...formulario, estudianteId: e.target.value})} required>
                <option value="">Seleccione...</option>
                {estudiantes.map(est => <option key={est.id} value={est.id}>{est.nombre} {est.apellido} - {est.cedula}</option>)}
              </select>
            </div>
            <div className="campo-formulario">
              <label>Tipo de Evento</label>
              <select value={formulario.tipoEvento} onChange={(e) => setFormulario({...formulario, tipoEvento: e.target.value})}>
                <option value="Inscripción">Inscripción</option>
                <option value="Cambio de Grado">Cambio de Grado</option>
                <option value="Observación Académica">Observación Académica</option>
                <option value="Entrega de Documentos">Entrega de Documentos</option>
                <option value="Retiro">Retiro</option>
              </select>
            </div>
            <div className="campo-formulario">
              <label>Fecha</label>
              <input type="date" value={formulario.fecha} onChange={(e) => setFormulario({...formulario, fecha: e.target.value})} />
            </div>
          </div>
          <div className="campo-formulario">
            <label>Descripción del Evento</label>
            <textarea rows="2" value={formulario.descripcion} onChange={(e) => setFormulario({...formulario, descripcion: e.target.value})} required />
          </div>
          <button type="submit" className="boton-primario">Guardar Evento</button>
        </form>
      </div>

      <div className="tarjeta">
        <h3>Historial de Trazabilidad</h3>
        {registros.length === 0 ? <p>No hay eventos registrados aún.</p> : (
          <table className="tabla">
          
              <thead>
              <tr>
                <th>Fecha</th>
                <th>Estudiante</th>
                <th>Evento</th>
                <th>Descripción</th>
                <th className="acciones-tabla">Acciones</th> {/* <-- NUEVA COLUMNA */}
              </tr>
            </thead>
            <tbody>
              {registros.map(reg => (
                <tr key={reg.id}>
                  <td>{reg.fecha}</td>
                  <td>{reg.estudianteNombre}</td>
                  <td><strong>{reg.tipoEvento}</strong></td>
                  <td>{reg.descripcion}</td>
                  {/* NUEVO BOTÓN */}
                  <td className="acciones-tabla">
                    <button onClick={() => eliminarRegistro(reg.id)} style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tbody>
              {registros.map(reg => (
                <tr key={reg.id}>
                  <td>{reg.fecha}</td>
                  <td>{reg.estudianteNombre}</td>
                  <td><strong>{reg.tipoEvento}</strong></td>
                  <td>{reg.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}