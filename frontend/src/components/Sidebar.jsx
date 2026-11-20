import { useState, useEffect } from 'react';
import './Sidebar.css';

export default function Sidebar({ vistaActiva, setVistaActiva, rol, cerrarSesion }) {
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // MENÚ PARA EL ADMINISTRADOR
  const menuAdmin = [
    { id: 'dashboard', label: 'Panel Principal' },
    
    { id: 'anos-escolares', label: 'Años Escolares'},
    { id: 'turnos', label: 'Turnos' },
    { id: 'aulas', label: 'Gestión de Aulas' },
    { id: 'grados', label: 'Grados'},
    { id: 'secciones', label: 'Secciones'},
    { id: 'asignaturas', label: 'Asignaturas'},


    { id: 'estudiantes', label: 'Estudiantes' },
    { id: 'docentes', label: 'Docentes' },

    { id: 'vista-docente', label: 'Portal Docente' },
    { id: 'trazabilidad', label: 'Trazabilidad Académica' },
    { id: 'eventos', label: 'Eventos y Efemérides' }, 
    { id: 'horarios', label: 'Horarios de Clases' },
    { id: 'procesos', label: 'Procesos Administrativos' },
    { id: 'proyectos', label: 'Proyectos' },

    { id: 'inventario', label: 'Inventario de Bienes' },
    { id: 'constancia', label: 'Generar Constancias' },
  //{ id: 'solicitudes', label: 'Solicitudes de Inscripción' }
  ];

  // MENÚ PARA EL DOCENTE
  const menuDocente = [
    { id: 'vista-docente', label: 'Mi Portal Docente' },
    { id: 'eventos', label: 'Eventos y Efemérides' }, // El docente también puede ver los eventos
    {id: 'horarios', label: 'Horarios de clases'}
  ];

  // MENÚ PARA EL REPRESENTANTE
  const menuRepresentante = [
    { id: 'inicio-representante', label: 'Mi Portal Representante' },
    { id: 'inscribir-estudiante', label: 'registar Estudiante' },
    { id: 'eventos', label: 'Eventos y Efemérides' }, // El representante también puede ver los eventos
    { id: 'inscripcion', label:'Inscripción' }
  ];

  const menuItems = rol === 'admin' ? menuAdmin : (rol === 'docente' ? menuDocente : menuRepresentante);

  return (
    <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', width: '220px' }}>
      <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/logo.jpg" alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'contain', backgroundColor: 'white', padding: '2px' }} />
        <div>
          <h2 style={{ fontSize: '16px' }}>E.E. Juana Ramírez</h2>
          <p style={{ textTransform: 'capitalize', fontSize: '12px', marginTop: '2px' }}>Sesión: {rol}</p>
        </div>
      </div>
      
      <div style={{ padding: '10px 20px', backgroundColor: 'rgba(0,0,0,0.2)', fontSize: '12px', color: '#cbd5e0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        {hora.toLocaleDateString()} <br/>
        {hora.toLocaleTimeString()}
      </div>

      <nav className="sidebar-nav" style={{ flex: 1, overflowY: 'auto' }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${vistaActiva === item.id ? 'activo' : ''}`}
            onClick={() => setVistaActiva(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: '20px' }}>
        <button 
          onClick={cerrarSesion}
          style={{ width: '100%', padding: '10px', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }}
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}