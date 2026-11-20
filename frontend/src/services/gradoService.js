import axiosClient from '../api/axiosClient';

export const getGrados = async () => {
  const response = await axiosClient.get('/grados');
  return response.data;
};

export const createGrado = async (gradoData) => {
  const response = await axiosClient.post('/grados', gradoData);
  return response.data;
};

export const updateGrado = async (id, gradoData) => {
  const response = await axiosClient.put(`/grados/${id}`, gradoData);
  return response.data;
};

export const deleteGrado = async (id) => {
  const response = await axiosClient.delete(`/grados/${id}`);
  return response.data;
};