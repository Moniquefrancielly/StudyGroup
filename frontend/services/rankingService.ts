import api from './api';

// ─── RANKING ────────────────────────────────────────────────

// Ranking mensal do grupo
export const listarRankingMensal = async (groupId: string) => {
  const res = await api.get(`/ranking/${groupId}`);
  return res.data;
};

// Histórico de ranking (para perfil)
export const listarHistoricoRanking = async (groupId: string) => {
  const res = await api.get(`/ranking/history/${groupId}`);
  return res.data;
};

// ─── CRONÔMETRO / SESSÃO DE ESTUDO ──────────────────────────

// Iniciar sessão de estudo
export const iniciarSessao = async (groupId: string) => {
  const res = await api.post('/timer/start', { groupId });
  return res.data;
};

// Encerrar sessão de estudo (backend calcula duração e atualiza ranking)
export const encerrarSessao = async (groupId: string) => {
  const res = await api.post('/timer/stop', { groupId });
  return res.data;
};

// ─── CHAMADA ────────────────────────────────────────────────

// Iniciar chamada do grupo
export const iniciarChamada = async (groupId: string) => {
  const res = await api.post('/call/start', { groupId });
  return res.data; // retorna { roomUrl: "..." }
};

// Encerrar chamada
export const encerrarChamada = async (groupId: string) => {
  const res = await api.post('/call/end', { groupId });
  return res.data;
};

// Buscar chamada ativa do grupo
export const buscarChamadaAtiva = async (groupId: string) => {
  const res = await api.get(`/call/active/${groupId}`);
  return res.data; // retorna { roomUrl: "..." } se houver chamada ativa
};

export const listarRankingDiario = async (groupId: string) => {
  const res = await api.get(`/ranking/daily/${groupId}`);
  return res.data;
};

export const buscarTempoMensal = async (groupId: string) => {
  const res = await api.get(`/ranking/monthly-time/${groupId}`);
  return res.data; // { totalTime: number, month: string }
};