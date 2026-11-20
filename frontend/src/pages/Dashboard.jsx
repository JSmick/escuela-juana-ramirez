import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEstudiantes: 0,
    masculinos: 0,
    femeninos: 0,
    totalDocentes: 0,
    docentesActivos: 0,
    incidencias: 0,
    matriculaGrados: {}
  });

  const gradosEscolares = ['Inicial', '1er Grado', '2do Grado', '3er Grado', '4to Grado', '5to Grado', '6to Grado'];

  useEffect(() => {
    const est = JSON.parse(localStorage.getItem('estudiantes_juana_ramirez') || '[]');
    const doc = JSON.parse(localStorage.getItem('docentes_juana_ramirez') || '[]');
    const obs = JSON.parse(localStorage.getItem('observaciones_juana_ramirez') || '[]');

    // Calcular estadísticas generales
    const masculinos = est.filter(e => e.genero === 'Masculino').length;
    const femeninos = est.filter(e => e.genero === 'Femenino').length;
    const docentesActivos = doc.filter(d => d.estatus === 'Activo' || d.estatus === 'Titular').length;

    // Calcular matrícula por grado
    const matriculaGrados = {};
    gradosEscolares.forEach(grado => {
      matriculaGrados[grado] = est.filter(e => e.grado === grado).length;
    });

    setStats({
      totalEstudiantes: est.length,
      masculinos,
      femeninos,
      totalDocentes: doc.length,
      docentesActivos,
      incidencias: obs.length,
      matriculaGrados
    });
  }, []);

  const cardStyle = {
    backgroundColor: 'white', padding: '20px', borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex',
    flexDirection: 'column', justifyContent: 'center', borderLeft: '5px solid #2c5282'
  };

  const horaActual = new Date().getHours();
  const saludo = horaActual < 12 ? ' Buenos días' : horaActual < 18 ? ' Buenas tardes' : ' Buenas noches';

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1>{saludo}</h1>
        <p style={{ color: '#718096' }}>Resumen general del sistema de la E.E. Juana Ramírez.</p>
      </div>

      {/* DISEÑO DE DOS COLUMNAS */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* COLUMNA IZQUIERDA: ESTADÍSTICAS GENERALES */}
        <div>
          <h3 style={{ marginBottom: '15px', color: '#2d3748' }}> Resumen de Población</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
            <div style={{ ...cardStyle, borderLeftColor: '#2c5282' }}>
              <span style={{ fontSize: '12px', color: '#718096', fontWeight: 'bold' }}>TOTAL ALUMNOS</span>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e3a5f' }}>{stats.totalEstudiantes}</span>
            </div>
            <div style={{ ...cardStyle, borderLeftColor: '#4299e1' }}>
              <span style={{ fontSize: '12px', color: '#718096', fontWeight: 'bold' }}>MASCULINOS</span>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#4299e1' }}>{stats.masculinos}</span>
            </div>
            <div style={{ ...cardStyle, borderLeftColor: '#ed64a6' }}>
              <span style={{ fontSize: '12px', color: '#718096', fontWeight: 'bold' }}>FEMENINAS</span>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#ed64a6' }}>{stats.femeninos}</span>
            </div>
          </div>

          <h3 style={{ marginBottom: '15px', color: '#2d3748' }}> Personal y Novedades</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            <div style={{ ...cardStyle, borderLeftColor: '#48bb78' }}>
              <span style={{ fontSize: '12px', color: '#718096', fontWeight: 'bold' }}>DOCENTES</span>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#48bb78' }}>{stats.totalDocentes}</span>
            </div>
            <div style={{ ...cardStyle, borderLeftColor: '#38a169' }}>
              <span style={{ fontSize: '12px', color: '#718096', fontWeight: 'bold' }}>ACTIVOS</span>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#38a169' }}>{stats.docentesActivos}</span>
            </div>
            <div style={{ ...cardStyle, borderLeftColor: '#e53e3e' }}>
              <span style={{ fontSize: '12px', color: '#718096', fontWeight: 'bold' }}>INCIDENCIAS</span>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#e53e3e' }}>{stats.incidencias}</span>
            </div>
          </div>

          <div className="tarjeta" style={{ marginTop: '30px', backgroundColor: '#ebf8ff', border: '1px solid #bee3f8' }}>
            <h4 style={{ color: '#2b6cb0', marginBottom: '10px' }}> Bienvenido al Sistema</h4>
            <p style={{ fontSize: '14px', color: '#2c5282' }}>
              Utiliza el menú de la izquierda para gestionar a los estudiantes, docentes, inventario y el Proyecto PEIC.
            </p>
          </div>
        </div>

        {/* COLUMNA DERECHA: MATRÍCULA DISCRIMINADA */}
        <div className="tarjeta" style={{ height: 'fit-content' }}>
          <h3 style={{ color: '#2d3748', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '15px' }}>
             Matrícula por Grado
          </h3>
          <table className="tabla" style={{ fontSize: '14px' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px' }}>Año / Grado</th>
                <th style={{ padding: '8px', textAlign: 'center' }}>Alumnos</th>
              </tr>
            </thead>
            <tbody>
              {gradosEscolares.map(grado => (
                <tr key={grado}>
                  <td style={{ padding: '8px' }}>{grado}</td>
                  <td style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold', color: stats.matriculaGrados[grado] > 0 ? '#2b6cb0' : '#a0aec0' }}>
                    {stats.matriculaGrados[grado] || 0}
                  </td>
                </tr>
              ))}
              <tr style={{ backgroundColor: '#f7fafc' }}>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>TOTAL GENERAL</td>
                <td style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold', color: '#1e3a5f' }}>{stats.totalEstudiantes}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}