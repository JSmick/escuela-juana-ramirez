/* import axiosClient from '../api/axiosClient';

export const createDocente = async (docenteData) => {
  const response = await axiosClient.post('/docente', docenteData);
  return response.data;
};

export const getDocenteByCedula = async (cedula) => {
  const response = await axiosClient.get(`/docente/cedula/${cedula}`);
  return response.data;
};

export const updateDocente = async (cedula, docenteData) => {
  const response = await axiosClient.put(`/docente/${cedula}`, docenteData);
  return response.data;
};

export const deleteDocente = async (cedula) => {
  const response = await axiosClient.delete(`/docente/${cedula}`);
  return response.data;import axiosClient from '../api/axiosClient';}; 

export const getDocentes = async () => {
  const response = await axiosClient.get('/docente');
  return response.data;
};

export const createDocente = async (docenteData) => {
  // Coincide con DocenteCreate (nombre, apellido, cédula, título, password_temporal, etc.)[cite: 16]
  const response = await axiosClient.post('/docente', docenteData);
  return response.data;
};

export const deleteDocente = async (cedula) => {
  const response = await axiosClient.delete(`/docente/${cedula}`);
  return response.data;
};*/
import axiosClient from '../api/axiosClient';

export const getDocentes = async () => {
  const response = await axiosClient.get('/docente'); // <-- Cambiado a singular
  return response.data;
};

export const createDocente = async (docenteData) => {
  const response = await axiosClient.post('/docente', docenteData); // <-- Cambiado a singular
  return response.data;
};

export const deleteDocente = async (cedula) => {
  const response = await axiosClient.delete(`/docente/${cedula}`); // <-- Cambiado a singular
  return response.data;
};