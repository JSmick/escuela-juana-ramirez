import axiosClient from '../api/axiosClient';

export const getProyectos = async () => {
  const response = await axiosClient.get('/proyectos');
  return response.data;
};

export const createProyecto = async (proyectoData) => {
  // Coincide con ProyectoCreate: titulo_proyecto, lapso_ejecu, estado_proyec, id_docente[cite: 23]
  const response = await axiosClient.post('/proyectos', proyectoData);
  return response.data;
};

export const deleteProyecto = async (id) => {
  const response = await axiosClient.delete(`/proyectos/${id}`);
  return response.data;
};