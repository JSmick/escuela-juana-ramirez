import axiosClient from '../api/axiosClient';

export const getTurnos = async () => {
  const response = await axiosClient.get('/turnos');
  return response.data;
};

export const createTurno = async (turnoData) => {
  // Coincide con TurnoCreate: { descripcion }[cite: 16]
  const response = await axiosClient.post('/turnos', turnoData);
  return response.data;
};

export const deleteTurno = async (id) => {
  const response = await axiosClient.delete(`/turnos/${id}`);
  return response.data;
};