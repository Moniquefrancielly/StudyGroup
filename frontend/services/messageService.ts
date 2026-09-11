import api from './api';

export const listarRecados = async (groupId: string) => {
  const res = await api.get(`/message/${groupId}`);
  return res.data;
};

export const criarRecado = async (groupId: string, text: string, poll?: { option1: string, option2: string }) => {
  const res = await api.post('/message/create', { groupId, text, poll });
  return res.data;
};

export const votarEnquete = async (messageId: string, option: string) => {
  const res = await api.post(`/message/${messageId}/vote`, { option });
  return res.data;
};

export const deletarRecado = async (messageId: string) => {
  const res = await api.delete(`/message/${messageId}`);
  return res.data;
};