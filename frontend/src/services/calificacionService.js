import axiosClient from '../api/axiosClient';

export const createCalificacion = async (data) => {
  const response = await axiosClient.post('/calificaciones', data);
  return response.data;
};

export const getCalificacionesEstudiante = async (idEstudiante) => {
  const response = await axiosClient.get(`/calificaciones/estudiante/${idEstudiante}`);
  return response.data;
};

// 👇 NUEVO: Para traer el historial completo
export const getCalificaciones = async () => {
  const response = await axiosClient.get('/calificaciones');
  return response.data;
};