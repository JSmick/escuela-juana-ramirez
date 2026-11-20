import axios from 'axios';

// Creamos la instancia de Axios con la URL base de tu backend en FastAPI
const axiosClient = axios.create({
  baseURL: 'http://localhost:8000', // Cambia el puerto si tu FastAPI corre en otro diferente (ej: 5000 o 8001)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de peticiones: Se ejecuta antes de que cualquier request salga hacia FastAPI
axiosClient.interceptors.request.use(
  (config) => {
    // Buscamos el token JWT guardado en el navegador tras iniciar sesión
    const token = localStorage.getItem('access_token');
    
    if (token) {
      // Si el token existe, lo adjuntamos automáticamente en la cabecera Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;