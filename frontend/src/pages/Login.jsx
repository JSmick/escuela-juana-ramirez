import { useState } from 'react';
import { loginService, registerRepresentanteService } from '../services/authService';

function obtenerDatosDelToken(token) {
  try {
    const payloadBase64 = token.split('.')[1];
    const payloadDecodificado = JSON.parse(atob(payloadBase64));
    return payloadDecodificado; // Devuelve { sub: "1", correo: "...", role: 3, exp: ... }
  } catch (error) {
    console.error("Error al leer el token:", error);
    return null;
  }
}

export default function Login({ alIniciarSesion, volverAtras }) {
  // Estado para alternar entre Login (false) y Registro (true)
  const [esRegistro, setEsRegistro] = useState(false);

  const [correo_user, setCorreoUser] = useState('');
  const [pass_user, setPassUser] = useState('');
  const [confirmarPass, setConfirmarPass] = useState('');
  
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [cargando, setCargando] = useState(false);
  

  // Limpia los campos al cambiar de vista
  const alternarModo = () => {
    setEsRegistro(!esRegistro);
    setError('');
    setMensajeExito('');
    setCorreoUser('');
    setPassUser('');
    setConfirmarPass('');
  };
  

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensajeExito('');
    setCargando(true);

    try {
      if (esRegistro) {
        // --- LÓGICA DE REGISTRO (ROL 3) ---
        if (pass_user !== confirmarPass) {
          setError('Las contraseñas no coinciden.');
          setCargando(false);
          return;
        }

        await registerRepresentanteService({ correo_user, pass_user });
        
        setMensajeExito('¡Cuenta de representante creada con éxito! Ahora puedes iniciar sesión.');
        setEsRegistro(false); // Regresa automáticamente al formulario de login
        setPassUser('');
        setConfirmarPass('');

      }else {
        // --- LÓGICA DE INICIO DE SESIÓN ---
        const data = await loginService({ correo_user, pass_user });
        localStorage.setItem('access_token', data.access_token);

        // 3. AQUÍ LA MANDAS A LLAMAR
        const datosToken = obtenerDatosDelToken(data.access_token);
        //****** */ 👉 AGREGA ESTAS LÍNEAS AQUÍ:
        if (datosToken?.sub) {
          localStorage.setItem('id_docente', datosToken.sub);
        }

        const mapaRoles = {
          1: 'admin',
          2: 'docente',
          3: 'representante'
        };

        const rolUsuario = mapaRoles[datosToken?.role] || 'representante';

        localStorage.setItem('sesion_juana', rolUsuario); 
        alIniciarSesion(rolUsuario);
      }
    } catch (err) {
      console.error(err);
      const detalleError = err.response?.data?.detail;
      setError(
        detalleError || 
        (esRegistro 
          ? 'Error al registrar el usuario. Verifica los datos.' 
          : 'Correo o contraseña incorrectos, o error de conexión.')
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f7fafc' }}>
      <div className="tarjeta" style={{ width: '400px', padding: '40px', textAlign: 'center' }}>
        
        <img src="/logo.jpg" alt="Logo" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'contain', backgroundColor: '#e2e8f0', marginBottom: '15px' }} />
        
        <h2 style={{ color: '#1e3a5f', marginBottom: '5px' }}>E.E. Juana Ramírez</h2>
        <p style={{ color: '#718096', marginBottom: '25px' }}>
          {esRegistro ? 'Registro de Representante' : 'Sistema de Control y Trazabilidad'}
        </p>

        {/* Mensajes de Error o Éxito */}
        {error && (
          <div style={{ backgroundColor: '#fed7d7', color: '#9b2c2c', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '14px' }}>
            {error}
          </div>
        )}
        
        {mensajeExito && (
          <div style={{ backgroundColor: '#c6f6d5', color: '#22543d', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '14px' }}>
            {mensajeExito}
          </div>
        )}

        <form onSubmit={manejarSubmit} style={{ textAlign: 'left' }}>
          <div className="campo-formulario">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="ejemplo@correo.com" 
              value={correo_user} 
              onChange={(e) => setCorreoUser(e.target.value)} 
              required 
            />
          </div>

          <div className="campo-formulario">
            <label>Contraseña</label>
            <input 
              type="password" 
              placeholder="••••" 
              value={pass_user} 
              onChange={(e) => setPassUser(e.target.value)} 
              required 
            />
          </div>

          {/* Campo extra solo visible cuando está en modo Registro */}
          {esRegistro && (
            <div className="campo-formulario">
              <label>Confirmar Contraseña</label>
              <input 
                type="password" 
                placeholder="••••" 
                value={confirmarPass} 
                onChange={(e) => setConfirmarPass(e.target.value)} 
                required 
              />
            </div>
          )}
          
          <button type="submit" className="boton-primario" style={{ width: '100%', marginTop: '10px', padding: '12px' }} disabled={cargando}>
            {cargando 
              ? 'Procesando...' 
              : (esRegistro ? 'Crear Cuenta' : 'Iniciar Sesión')
            }
          </button>
          
          {/* Botón para alternar entre Login y Registro */}
          <button 
            type="button" 
            onClick={alternarModo}
            style={{ width: '100%', marginTop: '15px', padding: '10px', backgroundColor: 'transparent', color: '#2b6cb0', border: 'none', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
          >
            {esRegistro ? '¿Ya tienes cuenta? Inicia sesión aquí' : 'Registrarse como Representante'}
          </button>

          <button 
            type="button" 
            onClick={volverAtras} 
            style={{ width: '100%', marginTop: '5px', padding: '10px', backgroundColor: 'transparent', color: '#718096', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Volver a la pantalla de bienvenida
          </button>
        </form>

      </div>
    </div>
  );
}