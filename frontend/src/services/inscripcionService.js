import axiosClient from '../api/axiosClient';

export const getInscripciones = async () => {
  const response = await axiosClient.get('/inscripciones');
  return response.data;
};

export const getInscripcionById = async (id) => {
  const response = await axiosClient.get(`/inscripciones/${id}`);
  return response.data;
};

export const createInscripcion = async (data) => {
  const response = await axiosClient.post('/inscripciones', data);
  return response.data;
};

export const updateInscripcion = async (id, data) => {
  const response = await axiosClient.put(`/inscripciones/${id}`, data);
  return response.data;
};

export const deleteInscripcion = async (id) => {
  const response = await axiosClient.delete(`/inscripciones/${id}`);
  return response.data;
};

export const getMisEstudiantes = async () => {
  const response = await axiosClient.get('/inscripciones/mis-estudiantes');
  return response.data;
};

export const getEstudiantesPorSeccion = async (idSeccion) => {
  const response = await axiosClient.get(`/inscripciones/seccion/${idSeccion}`);
  return response.data;
};

export const getEstudiantesPorGrado = async (idGrado) => {
  // ⚠️ ajusta cuando corrijas el router: /inscripciones/grado/{id}
  const response = await axiosClient.get(`/inscripciones/grado/${idGrado}`);
  return response.data;
};