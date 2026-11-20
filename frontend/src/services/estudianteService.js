/* import axiosClient from '../api/axiosClient';

export const getEstudiantes = async (skip = 0, limit = 100) => {
  const response = await axiosClient.get(`/estudiantes?skip=${skip}&limit=${limit}`);
  return response.data;
};

export const createEstudiante = async (estudianteData) => {
  const response = await axiosClient.post('/estudiantes', estudianteData);
  return response.data;
};

export const updateEstudiante = async (id, estudianteData) => {
  const response = await axiosClient.put(`/estudiantes/${id}`, estudianteData);
  return response.data;
};

export const deleteEstudiante = async (id) => {
  const response = await axiosClient.delete(`/estudiantes/${id}`);
  return response.data;
}; */

import axiosClient from '../api/axiosClient';

export const getEstudiantes = async () => {
  const response = await axiosClient.get('/estudiantes');
  return response.data;
};

export const createEstudiante = async (estudianteData) => {
  // Coincide con EstudianteCreate (nombre, apellido, fecha_nac, género, observaciones)[cite: 17]
  const response = await axiosClient.post('/estudiantes', estudianteData);
  return response.data;
};

export const deleteEstudiante = async (id) => {
  const response = await axiosClient.delete(`/estudiantes/${id}`);
  return response.data;
};