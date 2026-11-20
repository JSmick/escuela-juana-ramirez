import axiosClient from '../api/axiosClient';

export const getEventos = async () => (await axiosClient.get('/eventos')).data;
export const createEvento = async (data) => (await axiosClient.post('/eventos', data)).data;
export const updateEvento = async (id, data) => (await axiosClient.put(`/eventos/${id}`, data)).data;
export const deleteEvento = async (id) => (await axiosClient.delete(`/eventos/${id}`)).data;