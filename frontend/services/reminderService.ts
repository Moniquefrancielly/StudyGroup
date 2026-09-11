import api from './api';

// Listar lembretes/eventos de um grupo
export const listarLembretes = async (groupId: string) => {
  const res = await api.get(`/reminder/${groupId}`);
  return res.data;
};

// Criar lembrete ou evento na agenda
export const criarLembrete = async (groupId: string, title: string, datetime: string) => {
  const res = await api.post('/reminder/create', { groupId, title, datetime });
  return res.data;
};

// Excluir lembrete
export const excluirLembrete = async (reminderId: string) => {
  const res = await api.delete(`/reminder/${reminderId}`);
  return res.data;
};