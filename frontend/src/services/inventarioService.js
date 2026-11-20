import axiosClient from '../api/axiosClient';

export const getInventarios = async () => {
  const response = await axiosClient.get('/inventario');
  return response.data;
};

export const createInventario = async (data) => {
  const response = await axiosClient.post('/inventario', data);
  return response.data;
};

export const updateInventario = async (id, data) => {
  const response = await axiosClient.patch(`/inventario/${id}`, data);
  return response.data;
};

export const deleteInventario = async (id) => {
  const response = await axiosClient.delete(`/inventario/${id}`);
  return response.data;
};