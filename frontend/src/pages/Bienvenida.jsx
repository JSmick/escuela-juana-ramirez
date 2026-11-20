import { useState, useEffect } from 'react';

export default function Bienvenida({ irAlLogin }) {
  // Aquí puedes cambiar las imágenes por fotos reales de la escuela si las tienes en la carpeta public
  const slides = [
    {
      imagen: '/imagenes/escuela.jpg',
      titulo: 'Bienvenidos a la E.E. Juana Ramírez',
      subtitulo: 'Formando a los líderes del mañana con excelencia y valores.'
    },
    {
      imagen: '/imagenes/escuela1.jpg',
      titulo: 'Educación de Calidad',
      subtitulo: 'Un espacio seguro y tecnológico para el aprendizaje.'
    },
    {
      imagen: '/imagenes/escuela2.jpg',
      titulo: 'Sistema de Control y Trazabilidad',
      subtitulo: 'Gestión administrativa y académica al alcance de un clic.'
    }
  ];

  const [slideActual, setSlideActual] = useState(0);

  //cada 5 segundos ojo
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideActual((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div 
      className="bienvenida-container" 
      style={{ backgroundImage: `url('${slides[slideActual].imagen}')` }}
    >
      <div className="bienvenida-overlay"></div>

      <div className="bienvenida-contenido">
        {/* Log escuela */}
        <img 
          src="/logo.jpg" 
          alt="Logo" 
          style={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: 'white', padding: '15px', marginBottom: '20px', objectFit: 'contain',  boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }} 
        />
        
        {/* Textos  carrusel */}
        <h1 style={{ animation: 'fadein 1s' }}>{slides[slideActual].titulo}</h1>
        <p>{slides[slideActual].subtitulo}</p>

        <button 
          onClick={irAlLogin}
          className="boton-primario" 
          style={{ fontSize: '18px', padding: '15px 40px', backgroundColor: '#e53e3e', transition: 'transform 0.2s' }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          Ingresar al Sistema
        </button>

        {/* Punticos indicadores */}
        <div className="carrusel-dots">
          {slides.map((_, index) => (
            <div 
              key={index} 
              className={`dot ${index === slideActual ? 'activo' : ''}`}
              onClick={() => setSlideActual(index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}