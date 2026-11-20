import axiosClient from '../api/axiosClient';

export const getAulas = async () => (await axiosClient.get('/aulas')).data;
export const createAula = async (data) => (await axiosClient.post('/aulas', data)).data;
export const updateAula = async (id, data) => (await axiosClient.put(`/aulas/${id}`, data)).data;
export const deleteAula = async (id) => (await axiosClient.delete(`/aulas/${id}`)).data;