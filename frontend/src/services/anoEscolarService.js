import axiosClient from '../api/axiosClient';

export const getAnosEscolares = async () => {
  const response = await axiosClient.get('/anos-escolares'); // Ajusta la ruta exacta de tu router si varía ligeramente
  return response.data;
};

export const createAnoEscolar = async (anoData) => {
  // Coincide con AnoEscolarCreate: { nombre, fecha_inicio, fecha_fin, es_actual }[cite: 15]
  const response = await axiosClient.post('/anos-escolares', anoData);
  return response.data;
};

export const deleteAnoEscolar = async (id) => {
  const response = await axiosClient.delete(`/anos-escolares/${id}`);
  return response.data;
};
