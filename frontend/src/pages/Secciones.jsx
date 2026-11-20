import { useState, useEffect } from 'react';
import { getSecciones, createSeccion, deleteSeccion } from '../services/seccionService';
import { getTurnos } from '../services/turnoService';
import { getGrados } from '../services/gradoService';
import { getAnosEscolares } from '../services/anoEscolarService';
import { getDocentes } from '../services/docenteService'; // <-- Agrega esta línea

export default function Secciones() {
  const [secciones, setSecciones] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [grados, setGrados] = useState([]);
  const [anos, setAnos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  
  const [mostrarForm, setMostrarForm] = useState(false);
  const [cargando, setCargando] = useState(false);

  const [formulario, setFormulario] = useState({
    descripcion: 'A',
    id_turno: '',
    id_grado: '',
    id_ano_escolar: '',
    id_docent: ''
  });

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      setCargando(true);
      const [secData, turData, graData, anoData, docData] = await Promise.all([
        getSecciones(),
        getTurnos(),
        getGrados(),
        getAnosEscolares(),
        getDocentes()
      ]);
      setSecciones(secData);
      setTurnos(turData);
      setGrados(graData);
      setAnos(anoData);
      setDocentes(docData);
    } catch (error) {
      console.error(error);
      alert('Error al cargar los datos para las secciones.');
    } finally {
      setCargando(false);
    }
  };

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const guardarSeccion = async (e) => {
    e.preventDefault();
    try {
      // Coincide con SeccionCreate: descripcion, id_turno, id_grado, id_ano_escolar, id_docent
      const datosAEnviar = {
        ...formulario,
        id_turno: Number(formulario.id_turno),
        id_grado: Number(formulario.id_grado),
        id_ano_escolar: Number(formulario.id_ano_escolar),
        id_docent: formulario.id_docent ? Number(formulario.id_docent) : null
      };

      await createSeccion(datosAEnviar);
      alert('¡Sección registrada con éxito!');
      setFormulario({ descripcion: 'A', id_turno: '', id_grado: '', id_ano_escolar: '', id_docent: '' });
      setMostrarForm(false);
      cargarDatosIniciales();
    } catch (error) {
      console.error(error);
      alert('Error al guardar la sección. Verifica los campos seleccionados.');
    }
  };

  const eliminarSeccionId = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta sección?')) {
      try {
        await deleteSeccion(id);
        cargarDatosIniciales();
      } catch (error) {
        console.error(error);
        alert('No se pudo eliminar la sección.');
      }
    }
  };

  const obtenerNombreGrado = (id) => {
    const grado = grados.find((g) => g.id_grad === id);
    return grado ? grado.descripcion : 'Sin grado';
  };

  const obtenerNombreTurno = (id) => {
    const turno = turnos.find((t) => t.id_turno === id);
    return turno ? turno.descripcion : 'Sin turno';
  };

  const obtenerNombreAno = (id) => {
    const ano = anos.find((a) => a.id_ano === id);
    return ano ? ano.nombre : 'Sin período';
  };

  const obtenerNombreDocente = (id) => {
    if (!id) return 'Sin asignar';
    const docente = docentes.find((d) => d.id_docen === id);
    return docente ? `${docente.nom} ${docente.apell}` : 'No encontrado';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Gestión de Secciones Académicas</h1>
        <button className="boton-primario" onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? 'Cancelar' : '+ Nueva Sección'}
        </button>
      </div>

      {mostrarForm && (
        <div className="tarjeta" style={{ marginBottom: '20px' }}>
          <h3>Registrar Nueva Sección</h3>
          <form onSubmit={guardarSeccion}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              
              <div className="campo-formulario">
                <label>Nombre / Letra (Ej: A, B, U)</label>
                <input 
                  type="text" 
                  name="descripcion" 
                  value={formulario.descripcion} 
                  onChange={manejarCambio} 
                  maxLength={10} 
                  required 
                />
              </div>

              <div className="campo-formulario">
                <label>Grado Académico</label>
                <select name="id_grado" value={formulario.id_grado} onChange={manejarCambio} required>
                  <option value="">Seleccione un grado</option>
                  {grados.map(g => (
                    <option key={g.id_grad} value={g.id_grad}>{g.descripcion}</option>
                  ))}
                </select>
              </div>

              <div className="campo-formulario">
                <label>Turno</label>
                <select name="id_turno" value={formulario.id_turno} onChange={manejarCambio} required>
                  <option value="">Seleccione un turno</option>
                  {turnos.map(t => (
                    <option key={t.id_turno} value={t.id_turno}>{t.descripcion}</option>
                  ))}
                </select>
              </div>

              <div className="campo-formulario">
                <label>Año Escolar</label>
                <select name="id_ano_escolar" value={formulario.id_ano_escolar} onChange={manejarCambio} required>
                  <option value="">Seleccione período</option>
                  {anos.map(a => (
                    <option key={a.id_ano} value={a.id_ano}>{a.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="campo-formulario">
                <label>Docente Guía (Opcional)</label>
                <select name="id_docent" value={formulario.id_docent} onChange={manejarCambio}>
                  <option value="">Sin docente asignado</option>
                  {docentes.map(d => (
                    <option key={d.id_docen} value={d.id_docen}>
                      {d.nom} {d.apell} ({d.cedula})
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <button type="submit" className="boton-primario" style={{ marginTop: '20px' }}>
              Guardar Sección
            </button>
          </form>
        </div>
      )}

      <div className="tarjeta">
        <h3>Secciones Registradas ({secciones.length})</h3>
        {cargando ? <p>Cargando...</p> : (
          <table className="tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Sección</th>
                <th>Grado</th>
                <th>Turno</th>
                <th>Año Escolar</th>
                <th>Docente Guía</th>
                <th>Estado</th>
                <th className="acciones-tabla">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {secciones.map(s => (
                <tr key={s.id_seccion}>
                  <td>{s.id_seccion}</td>
                  <td><strong>{s.descripcion}</strong></td>
                  <td>{obtenerNombreGrado(s.id_grado)}</td>
                  <td>{obtenerNombreTurno(s.id_turno)}</td>
                  <td>{obtenerNombreAno(s.id_ano_escolar)}</td>
                  <td>{obtenerNombreDocente(s.id_docent)}</td>
                  <td>{s.is_active ? 'Activa' : 'Inactiva'}</td>
                  <td className="acciones-tabla">
                    <button onClick={() => eliminarSeccionId(s.id_seccion)} style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}