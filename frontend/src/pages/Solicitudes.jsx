import { useState, useEffect } from 'react';

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    setSolicitudes(JSON.parse(localStorage.getItem('solicitudes_inscripcion_juana') || '[]'));
  }, []);

  const aprobarSolicitud = (solicitud) => {
    // 1. Lo pasamos a la lista oficial de estudiantes
    const estudiantesActuales = JSON.parse(localStorage.getItem('estudiantes_juana_ramirez') || '[]');
    const nuevoEstudiante = {
      ...solicitud,
      id: Date.now(), // Generamos un ID nuevo para el alumno oficial
      fechaRegistro: new Date().toISOString(),
      estado: 'Activo'
    };
    localStorage.setItem('estudiantes_juana_ramirez', JSON.stringify([...estudiantesActuales, nuevoEstudiante]));

    // 2. Eliminamos la solicitud de la lista de pendientes
    eliminarSolicitud(solicitud.id_solicitud);
    alert('¡Estudiante aprobado e ingresado al sistema oficial!');
  };

  const eliminarSolicitud = (id) => {
    if(window.confirm('¿Está seguro de rechazar/eliminar esta solicitud?')) {
      const nuevas = solicitudes.filter(s => s.id_solicitud !== id);
      setSolicitudes(nuevas);
      localStorage.setItem('solicitudes_inscripcion_juana', JSON.stringify(nuevas));
    }
  };

  return (
    <div>
      <h1>Solicitudes de Inscripción</h1>
      <p style={{ color: '#718096', marginBottom: '20px' }}>Revise los datos enviados por los representantes y apruébelos para ingresarlos al sistema.</p>

      <div className="tarjeta">
        <h3>Solicitudes Pendientes ({solicitudes.length})</h3>
        <table className="tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Alumno</th>
              <th>Grado</th>
              <th>Representante</th>
              <th>Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map(sol => (
              <tr key={sol.id_solicitud}>
                <td>{sol.fecha_solicitud}</td>
                <td><strong>{sol.apellido}, {sol.nombre}</strong><br/><small>{sol.cedula}</small></td>
                <td>{sol.grado}</td>
                <td>{sol.rep_nombre} {sol.rep_apellido} ({sol.rep_parentesco})</td>
                <td>{sol.rep_telefono} <br/><small>{sol.rep_correo}</small></td>
                <td>
                  <button onClick={() => aprobarSolicitud(sol)} style={{ background: '#48bb78', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>✓ Aprobar</button>
                  <button onClick={() => eliminarSolicitud(sol.id_solicitud)} style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Rechazar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}