import api from './api';

// Listar grupos do usuário logado
export const listarMeusGrupos = async () => {
  const res = await api.get('/group/my-groups');
  return res.data;
};

// Criar novo grupo
export const criarGrupo = async (name: string) => {
  const res = await api.post('/group/create', { name });
  return res.data;
};

// Entrar em grupo por código de convite
export const entrarPorConvite = async (inviteCode: string) => {
  const res = await api.post('/group/join-invite', { inviteCode });
  return res.data;
};

// Listar membros de um grupo
export const listarMembros = async (groupId: string) => {
  const res = await api.get(`/group/${groupId}/members`);
  return res.data;
};

// Gerar código/link de convite
export const gerarConvite = async (groupId: string) => {
  const res = await api.post('/group/invite', { groupId });
  return res.data;
};

// Editar nome do grupo
export const editarGrupo = async (groupId: string, newName: string) => {
  const res = await api.put('/group/update', { groupId, newName });
  return res.data;
};

// Sair do grupo
export const sairDoGrupo = async (groupId: string) => {
  const res = await api.post('/group/leave', { groupId });
  return res.data;
};

// Excluir grupo (somente admin)
export const excluirGrupo = async (groupId: string) => {
  const res = await api.post('/group/delete-group', { groupId });
  return res.data;
};

// Remover membro (somente admin)
export const removerMembro = async (groupId: string, userIdToRemove: string) => {
  const res = await api.delete('/group/remove-user', { data: { groupId, userIdToRemove } });
  return res.data;
};

// Transferir administração (somente admin)
export const transferirAdmin = async (groupId: string, newAdminId: string) => {
  const res = await api.post('/group/transfer-admin', { groupId, newAdminId });
  return res.data;
};

// Listar solicitações de entrada pendentes
export const listarSolicitacoes = async (groupId: string) => {
  const res = await api.get(`/group/${groupId}/requests`);
  return res.data;
};

// Aprovar solicitação de entrada
export const aprovarSolicitacao = async (groupId: string, requestId: string) => {
  const res = await api.post('/group/approve-request', { groupId, requestId });
  return res.data;
};

// Recusar solicitação de entrada
export const recusarSolicitacao = async (groupId: string, requestId: string) => {
  const res = await api.post('/group/reject-request', { groupId, requestId });
  return res.data;
};

// Denunciar usuário
export const denunciarUsuario = async (groupId: string, reportedUserId: string, reason: string) => {
  const res = await api.post('/report/create', { groupId, reportedUserId, reason });
  return res.data;
};