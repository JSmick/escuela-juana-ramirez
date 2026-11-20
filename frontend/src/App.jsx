import { useState, useEffect } from 'react';
import './App.css';

import AnoEscolar from './pages/AnoEscolar';
import Aulas from './pages/Aulas';
import Asignaturas from './pages/Asignaturas';
import Bienvenida from './pages/Bienvenida';
import Constancia from './pages/Constancia';
import Dashboard from './pages/Dashboard';
import Docentes from './pages/Docentes';
import Estudiantes from './pages/Estudiantes';
import Eventos from './pages/Eventos';
import Grados from './pages/Grados';
import Horarios from './pages/Horarios';
import Inventario from './pages/Inventario';
import Login from './pages/Login';
import Proyectos from './pages/Proyectos';
import PortalRepresentante from './pages/PortalRepresentante';
import InscribirEstudiante from './pages/InscribirEstudiante';
import Procesos from './pages/Procesos';
import Secciones from './pages/Secciones';
import Solicitudes from './pages/Solicitudes';
import Trazabilidad from './pages/Trazabilidad';
import Turnos  from './pages/Turnos'; 
import VistaDocente from './pages/VistaDocente';

import Sidebar from './components/Sidebar';
import Inscripciones from './pages/Inscripciones';



function App() {
  const [logueado, setLogueado] = useState(false);
  const [rol, setRol] = useState(null);
  const [vistaActiva, setVistaActiva] = useState('dashboard');
  const [enBienvenida, setEnBienvenida] = useState(true);

  useEffect(() => {
    const sesionGuardada = localStorage.getItem('sesion_juana');
    if (sesionGuardada) {
      setRol(sesionGuardada);
      setLogueado(true);
      setEnBienvenida(false);

      if (sesionGuardada === 'docente') setVistaActiva('vista-docente');
      else if (sesionGuardada === 'representante') setVistaActiva('inicio-representante');
      else setVistaActiva('dashboard');
    }
  }, []);

  const iniciarSesion = (tipoUsuario) => {
    localStorage.setItem('sesion_juana', tipoUsuario);
    setRol(tipoUsuario);
    setLogueado(true);
    
    if (tipoUsuario === 'docente') setVistaActiva('vista-docente');
    else if (tipoUsuario === 'representante') setVistaActiva('inicio-representante');
    else setVistaActiva('dashboard');
  };


  const cerrarSesion = () => {
    localStorage.removeItem('sesion_juana');
    setLogueado(false);
    setRol(null);
    setEnBienvenida(true);
    window.history.replaceState(null, '', '/'); 
  };

  if (!logueado) {
    if (enBienvenida) {
      return <Bienvenida irAlLogin={() => setEnBienvenida(false)} />;
    }
    return <Login alIniciarSesion={iniciarSesion} volverAtras={() => setEnBienvenida(true)} />;
  }

  const renderizarVista = () => {

    if (rol === 'representante') {
      if (vistaActiva === 'inscribir-estudiante') {
        return <InscribirEstudiante irAInicio={() => setVistaActiva('inicio-representante')} />;
      }
      if (vistaActiva === 'eventos') {
        return <Eventos />;
      }
      if (vistaActiva === 'inscripcion') {
        return <Inscripciones />;
      }
      return <PortalRepresentante />;
    }
    // Bloqueo de seguridad para docentes
    if (rol === 'docente' && ['estudiantes', 'docentes', 'procesos', 'inventario', 'peic', 'solicitudes', 'constancia'].includes(vistaActiva)) {
       return (
         <div className="tarjeta">
           <h2 style={{ color: '#e53e3e' }}>Acceso Denegado</h2>
           <p>No tienes permisos de administrador para ver esta sección.</p>
         </div>
       );
    }

    if (vistaActiva === 'estudiantes') return <Estudiantes />;
    if (vistaActiva === 'anos-escolares') return <AnoEscolar/>;
    if (vistaActiva === 'turnos') return <Turnos/>;
    if (vistaActiva === 'grados') return <Grados/>;
    if (vistaActiva === 'asignaturas') return <Asignaturas/>;
    if (vistaActiva === 'secciones') return <Secciones/>;

    if (vistaActiva === 'docentes') return <Docentes />;
    if (vistaActiva === 'vista-docente') return <VistaDocente />;
    if (vistaActiva === 'trazabilidad') return <Trazabilidad />;
    if (vistaActiva === 'procesos') return <Procesos />;
    if (vistaActiva === 'inventario') return <Inventario />;
    if (vistaActiva === 'horarios') return <Horarios />;
    if (vistaActiva === 'proyectos') return <Proyectos />;
    if (vistaActiva === 'constancia') return <Constancia />;
   // if (vistaActiva === 'solicitudes') return <Solicitudes />;
    if (vistaActiva === 'eventos') return <Eventos />;
    if (vistaActiva === 'aulas') return <Aulas />;

    

    
    return <Dashboard />;
  };

  return (
    <div className="app-container">
      <Sidebar 
        vistaActiva={vistaActiva} 
        setVistaActiva={setVistaActiva} 
        rol={rol} 
        cerrarSesion={cerrarSesion}
      />
      <main className="contenido-principal">
        {renderizarVista()}
      </main>
    </div>
  );
}

export default App;