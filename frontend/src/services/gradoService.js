import axiosClient from '../api/axiosClient';

export const getGrados = async () => {
  const response = await axiosClient.get('/grados');
  return response.data;
};

export const createGrado = async (gradoData) => {
  // Coincide con GradoCreate: { descripcion }[cite: 11]
  const response = await axiosClient.post('/grados', gradoData);
  return response.data;
};

export const deleteGrado = async (id) => {
  const response = await axiosClient.delete(`/grados/${id}`);
  return response.data;
};