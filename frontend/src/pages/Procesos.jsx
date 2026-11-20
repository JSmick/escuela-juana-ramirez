import { useState, useEffect } from 'react';

export default function Procesos() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [formulario, setFormulario] = useState({ solicitante: '', tipo: 'Constancia de Estudios', motivo: '', estado: 'Pendiente' });

  useEffect(() => {
    const guardadas = JSON.parse(localStorage.getItem('procesos_juana_ramirez') || '[]');
    setSolicitudes(guardadas);
  }, []);

  useEffect(() => {
    localStorage.setItem('procesos_juana_ramirez', JSON.stringify(solicitudes));
  }, [solicitudes]);

  const agregarSolicitud = (e) => {
    e.preventDefault();
    const nueva = { ...formulario, id: Date.now(), fecha: new Date().toLocaleDateString() };
    setSolicitudes([nueva, ...solicitudes]);
    setFormulario({ ...formulario, solicitante: '', motivo: '' });
  };

  const cambiarEstado = (id, nuevoEstado) => {
    setSolicitudes(solicitudes.map(sol => sol.id === id ? { ...sol, estado: nuevoEstado } : sol));
  };

    const eliminarSolicitud = (id) => {
    if (window.confirm('¿Está seguro de eliminar esta solicitud permanentemente?')) {
      setSolicitudes(solicitudes.filter(sol => sol.id !== id));
    }
  };

  return (
    <div>
      <h1>Procesos Administrativos</h1>
      <p style={{ color: '#718096', marginBottom: '20px' }}>Gestión de constancias, permisos y solicitudes.</p>

      <div className="tarjeta">
        <h3>Registrar Solicitud</h3>
        <form onSubmit={agregarSolicitud}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="campo-formulario">
              <label>Nombre del Solicitante</label>
              <input value={formulario.solicitante} onChange={(e) => setFormulario({...formulario, solicitante: e.target.value})} required />
            </div>
            <div className="campo-formulario">
              <label>Tipo de Documento</label>
              <select value={formulario.tipo} onChange={(e) => setFormulario({...formulario, tipo: e.target.value})}>
                <option value="Constancia de Estudios">Constancia de Estudios</option>
                <option value="Constancia de Buena Conducta">Constancia de Buena Conducta</option>
                <option value="Notas Certificadas">Notas Certificadas</option>
                <option value="Permiso de Salida">Permiso de Salida</option>
              </select>
            </div>
          </div>
          <div className="campo-formulario">
            <label>Motivo</label>
            <input value={formulario.motivo} onChange={(e) => setFormulario({...formulario, motivo: e.target.value})} />
          </div>
          <button type="submit" className="boton-primario">Registrar Solicitud</button>
        </form>
      </div>

      <div className="tarjeta">
        <h3>Solicitudes Recibidas</h3>
        <table className="tabla">
          <thead>
            <tr>
                          <thead>
              <tr>
                <th>Fecha</th>
                <th>Solicitante</th>
                <th>Documento</th>
                <th>Estado</th>
                <th className="acciones-tabla">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map(sol => (
                <tr key={sol.id}>
                  <td>{sol.fecha}</td>
                  <td>{sol.solicitante}</td>
                  <td>{sol.tipo}</td>
                  <td>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', backgroundColor: sol.estado === 'Pendiente' ? '#feebc8' : (sol.estado === 'Aprobado' ? '#c6f6d5' : '#fed7d7'), color: sol.estado === 'Pendiente' ? '#c05621' : (sol.estado === 'Aprobado' ? '#276749' : '#9b2c2c') }}>
                      {sol.estado}
                    </span>
                  </td>
                  <td className="acciones-tabla">
                    {/* BOTÓN APROBAR (Solo si está pendiente) */}
                    {sol.estado === 'Pendiente' && (
                      <button onClick={() => cambiarEstado(sol.id, 'Aprobado')} style={{ background: '#48bb78', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Aprobar</button>
                    )}
                    {/* BOTÓN ELIMINAR */}
                    <button onClick={() => eliminarSolicitud(sol.id)} style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map(sol => (
              <tr key={sol.id}>
                <td>{sol.fecha}</td>
                <td>{sol.solicitante}</td>
                <td>{sol.tipo}</td>
                <td>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', backgroundColor: sol.estado === 'Pendiente' ? '#feebc8' : (sol.estado === 'Aprobado' ? '#c6f6d5' : '#fed7d7'), color: sol.estado === 'Pendiente' ? '#c05621' : (sol.estado === 'Aprobado' ? '#276749' : '#9b2c2c') }}>
                    {sol.estado}
                  </span>
                </td>
                <td>
                  {sol.estado === 'Pendiente' && (
                    <button onClick={() => cambiarEstado(sol.id, 'Aprobado')} style={{ background: '#48bb78', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Aprobar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}