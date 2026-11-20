import axiosClient from '../api/axiosClient';

export const getHorarios = async () => {
  const response = await axiosClient.get('/horarios');
  return response.data;
};

export const getHorariosPorDocente = async (idDocente) => {
  const response = await axiosClient.get(`/horarios/docente/${idDocente}`);
  return response.data;
};

export const createHorario = async (data) => {
  const response = await axiosClient.post('/horarios', data);
  return response.data;
};

export const updateHorario = async (id, data) => {
  const response = await axiosClient.put(`/horarios/${id}`, data);
  return response.data;
};

export const deleteHorario = async (id) => {
  const response = await axiosClient.delete(`/horarios/${id}`);
  return response.data;
};