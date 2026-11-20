import axiosClient from '../api/axiosClient';

export const loginService = async (datosLogin) => {
  // Envía { correo, password } al endpoint /auth/login de FastAPI[cite: 6]
  const response = await axiosClient.post('/auth/login', datosLogin);
  return response.data; // Devuelve el token { access_token, token_type }[cite: 6]
};

export const registerService = async (datosUsuario) => {
  const response = await axiosClient.post('/auth/register', datosUsuario);
  return response.data;
};

export const registerRepresentanteService = async (datosUsuario) => {
  // Aseguramos que se envíe el rol 3 si usas un esquema genérico
  const payload = { ...datosUsuario, id_rol: 3 };
  const response = await axiosClient.post('/auth/register/representante', payload);
  return response.data;
};

