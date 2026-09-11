const {
  createGroup, joinGroup, leaveGroup, removeUser, transferAdmin,
  generateInvite, joinByInvite, updateGroupName, getGroupMembers, 
  approveRequest, rejectRequest, deleteGroup, getMyGroups, getJoinRequests
} = require("../services/groupService");


// 🔹 CRIAR GRUPO

const create = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.uid;

    const group = await createGroup(userId, name);

    return res.status(201).json(group);
  } catch (error) {
    console.error("ERRO REAL:", error);
    return res.status(500).json({ error: error.message });
  }
};

// 🔹 ENTRAR NO GRUPO

const join = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { groupId } = req.body;

    const result = await joinGroup(userId, groupId);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// 🔹 ATUALIZAR NOME DO GRUPO (ADMIN)
const updateGroup = async (req, res) => {
  try {
    const adminId = req.user.uid;
    const { groupId, newName } = req.body;
    const result = await updateGroupName(adminId, groupId, newName);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// 🔹 LISTAR MEMBROS DO GRUPO
const listMembers = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { groupId } = req.params;
    const result = await getGroupMembers(userId, groupId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

//////////////////////////////////////////////////////
// 🔹 SAIR DO GRUPO

const leave = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { groupId } = req.body;

    const result = await leaveGroup(userId, groupId);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// 🔹 REMOVER USUÁRIO (ADMIN)

const remove = async (req, res) => {
  try {
    const adminId = req.user.uid; // 🔥 pega quem está logado
    const { groupId, userIdToRemove } = req.body;

    const result = await removeUser(adminId, groupId, userIdToRemove);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// 🔹 TRANSFERIR ADMIN (ADMIN)

const transfer = async (req, res) => {
  try {
    const adminId = req.user.uid; // 🔥 pega quem está logado
    const { groupId, newAdminId } = req.body;

    const result = await transferAdmin(adminId, groupId, newAdminId);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// 🔻 EXPORT


const invite = async (req, res) => {
  try {
    const adminId = req.user.uid;
    const { groupId } = req.body;
    const result = await generateInvite(adminId, groupId);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const joinViaInvite = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { inviteCode } = req.body;
    const result = await joinByInvite(userId, inviteCode);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// 🔹 APROVAR SOLICITAÇÃO

const approve = async (req, res) => {
  try {
    const adminId = req.user.uid;
    const { requestId } = req.body;
    const result = await approveRequest(adminId, requestId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// 🔹 RECUSAR SOLICITAÇÃO

const reject = async (req, res) => {
  try {
    const adminId = req.user.uid;
    const { requestId } = req.body;
    const result = await rejectRequest(adminId, requestId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// 🔹 DELETAR GRUPO (ADMIN ONLY)

const removeGroup = async (req, res) => {
  console.log("DELETE GROUP CHAMADO");
  console.log("BODY:", req.body);
  console.log("USER:", req.user);

  try {
    const adminId = req.user.uid;
    const { groupId } = req.body;

    const result = await deleteGroup(adminId, groupId);

    return res.status(200).json(result);
  } catch (error) {
    console.error("ERRO DELETE GROUP:", error);

    return res.status(400).json({
      error: error.message,
    });
  }
};
  
const myGroups = async (req, res) => {
  try {
    const userId = req.user.uid;
    const result = await getMyGroups(userId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

  const listRequests = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { groupId } = req.params;
    const result = await getJoinRequests(userId, groupId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  create, join, leave, remove, transfer,
  invite, joinViaInvite, updateGroup, listMembers,
  approve, reject, removeGroup, myGroups, listRequests
};