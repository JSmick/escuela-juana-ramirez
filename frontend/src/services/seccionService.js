import axiosClient from '../api/axiosClient';

export const getSecciones = async () => {
  const response = await axiosClient.get('/secciones');
  return response.data;
};

export const createSeccion = async (seccionData) => {
  // Coincide con SeccionCreate: { descripcion, id_turno, id_grado, id_ano_escolar, id_docent }[cite: 14]
  const response = await axiosClient.post('/secciones', seccionData);
  return response.data;
};

export const deleteSeccion = async (id) => {
  const response = await axiosClient.delete(`/secciones/${id}`);
  return response.data;
};