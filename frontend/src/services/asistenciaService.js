import axiosClient from '../api/axiosClient';

export const createAsistencia = async (data) => {
  const response = await axiosClient.post('/asistencias', data);
  return response.data;
};


export const getAsistenciasPorSeccion = async (idSeccion) => {
  const response = await axiosClient.get(`/asistencias/seccion/${idSeccion}`);
  return response.data;
};