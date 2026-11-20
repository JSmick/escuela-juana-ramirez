import axiosClient from '../api/axiosClient';

export const getAsignaturas = async () => {
  const response = await axiosClient.get('/asignaturas');
  return response.data;
};

export const createAsignatura = async (asignaturaData) => {
  // Coincide con AsignaturaCreate: { descripcion }[cite: 8]
  const response = await axiosClient.post('/asignaturas', asignaturaData);
  return response.data;
};

export const deleteAsignatura = async (id) => {
  const response = await axiosClient.delete(`/asignaturas/${id}`);
  return response.data;
};