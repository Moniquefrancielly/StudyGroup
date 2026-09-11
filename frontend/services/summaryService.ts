import api from './api';

// Listar resumos de um grupo
export const listarResumos = async (groupId: string) => {
  const res = await api.get(`/summary/${groupId}`);
  return res.data;
};

// Buscar detalhe de um resumo
export const detalheResumo = async (summaryId: string) => {
  const res = await api.get(`/summary/detail/${summaryId}`);
  return res.data;
};

// Criar novo resumo
export const criarResumo = async (groupId: string, title: string, content: string) => {
  const res = await api.post('/summary/create', { groupId, title, content });
  return res.data;
};

// Excluir resumo
export const excluirResumo = async (summaryId: string) => {
  const res = await api.delete(`/summary/${summaryId}`);
  return res.data;
};

// Listar comentários de um resumo
export const listarComentarios = async (summaryId: string) => {
  const res = await api.get(`/summary/${summaryId}/comments`);
  return res.data;
};

// Adicionar comentário em um resumo
export const adicionarComentario = async (summaryId: string, text: string) => {
  const res = await api.post(`/summary/${summaryId}/comment`, { text });
  return res.data;
};