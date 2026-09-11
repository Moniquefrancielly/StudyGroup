const { admin, db } = require("../config/firebaseAdmin");
const { v4: uuidv4 } = require("uuid");
const { sendToUser, sendToGroup } = require("./notificationService");

// 🔹 CREATE GROUP

const createGroup = async (userId, name) => {
  const groupId = uuidv4();

  const group = {
    id: groupId,
    name,
    adminId: userId,
    createdAt: new Date(),
  };

  await db.collection("groups").doc(groupId).set(group);

  await db.collection("groupMembers").add({
    groupId,
    userId,
    role: "admin",
  });

  return group;
};

// 🔹 JOIN GROUP

const joinGroup = async (userId, groupId) => {
  const groupDoc = await db.collection("groups").doc(groupId).get();

  if (!groupDoc.exists) {
    throw new Error("Grupo não existe");
  }

  // 🔒 evita entrar duas vezes
  const existing = await db
    .collection("groupMembers")
    .where("groupId", "==", groupId)
    .where("userId", "==", userId)
    .get();

  if (!existing.empty) {
    throw new Error("Usuário já está no grupo");
  }

  await db.collection("groupMembers").add({
    groupId,
    userId,
    role: "member",
  });

  return { message: "Entrou no grupo" };
};

// 🔹 LEAVE GROUP

const leaveGroup = async (userId, groupId) => {
  // Verifica se é o admin tentando sair
  const groupDoc = await db.collection("groups").doc(groupId).get();
  if (groupDoc.exists && groupDoc.data().adminId === userId) {
    throw new Error("Admin não pode sair sem transferir o cargo primeiro");
  }

  const snapshot = await db
    .collection("groupMembers")
    .where("groupId", "==", groupId)
    .where("userId", "==", userId)
    .get();

  if (snapshot.empty) {
    throw new Error("Usuário não está no grupo");
  }

  snapshot.forEach(doc => doc.ref.delete());
  return { message: "Saiu do grupo" };
};

// 🔹 REMOVE USER (ADMIN ONLY)

const removeUser = async (adminId, groupId, userIdToRemove) => {
  const groupRef = db.collection("groups").doc(groupId);
  const group = await groupRef.get();

  if (!group.exists) {
    throw new Error("Grupo não existe");
  }

  if (group.data().adminId !== adminId) {
    throw new Error("Apenas admin pode remover");
  }

  const snapshot = await db
    .collection("groupMembers")
    .where("groupId", "==", groupId)
    .where("userId", "==", userIdToRemove)
    .get();

  if (snapshot.empty) {
    throw new Error("Usuário não encontrado no grupo");
  }

  snapshot.forEach(doc => doc.ref.delete());

  await sendToUser(userIdToRemove, "❌ Removido do grupo", "Você foi removido do grupo pelo administrador.");

  return { message: "Usuário removido" };
};

// 🔹 TRANSFER ADMIN

const transferAdmin = async (adminId, groupId, newAdminId) => {
  const groupRef = db.collection("groups").doc(groupId);
  const group = await groupRef.get();

  if (!group.exists) throw new Error("Grupo não existe");
  if (group.data().adminId !== adminId) throw new Error("Apenas admin pode transferir");

  // ✅ Atualiza o adminId no grupo
  await groupRef.update({ adminId: newAdminId });

  // ✅ Atualiza role do novo admin
  const newAdminSnap = await db.collection("groupMembers")
    .where("groupId", "==", groupId)
    .where("userId", "==", newAdminId)
    .get();
  newAdminSnap.forEach(doc => doc.ref.update({ role: "admin" }));

  // ✅ Rebaixa o antigo admin para member
  const oldAdminSnap = await db.collection("groupMembers")
    .where("groupId", "==", groupId)
    .where("userId", "==", adminId)
    .get();
  oldAdminSnap.forEach(doc => doc.ref.update({ role: "member" }));

  return { message: "Admin transferido" };
};

// 🔻 EXPORTS

const generateInvite = async (userId, groupId) => {
  const groupDoc = await db.collection("groups").doc(groupId).get();
  if (!groupDoc.exists) throw new Error("Grupo não existe");

  const inviteCode = uuidv4().slice(0, 8).toUpperCase();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await db.collection("invites").add({
    groupId,
    code: inviteCode,
    createdBy: userId,
    expiresAt,
    used: false,
  });

  return { inviteCode, expiresAt };
};

const joinByInvite = async (userId, inviteCode) => {
  const snapshot = await db.collection("invites")
    .where("code", "==", inviteCode)
    .where("used", "==", false)
    .get();

  if (snapshot.empty) throw new Error("Convite inválido ou expirado");

  const inviteDoc = snapshot.docs[0];
  const invite = inviteDoc.data();

  if (invite.expiresAt.toDate() < new Date()) throw new Error("Convite expirado");

  const existing = await db.collection("groupMembers")
    .where("groupId", "==", invite.groupId)
    .where("userId", "==", userId)
    .get();
  if (!existing.empty) throw new Error("Usuário já está no grupo");

  // 🔹 Cria solicitação pendente ao invés de entrar direto
  await db.collection("joinRequests").add({
    groupId: invite.groupId,
    userId,
    status: "pending",
    createdAt: new Date(),
  });
  console.log("solicitação criada para groupId:", invite.groupId);

  // 🔹 Notifica o admin
  const groupDoc = await db.collection("groups").doc(invite.groupId).get();
  const adminId = groupDoc.data().adminId;
  await sendToUser(adminId, "👥 Solicitação de entrada!", "Um usuário quer entrar no seu grupo. Acesse para aprovar ou recusar.");

  return { message: "Solicitação enviada, aguarde aprovação do admin." };
};

// 🔹 APROVAR SOLICITAÇÃO

const approveRequest = async (adminId, requestId) => {
  const requestRef = db.collection("joinRequests").doc(requestId);
  const requestDoc = await requestRef.get();

  if (!requestDoc.exists) throw new Error("Solicitação não encontrada");

  const request = requestDoc.data();

  const groupDoc = await db.collection("groups").doc(request.groupId).get();
  if (groupDoc.data().adminId !== adminId) throw new Error("Apenas admin pode aprovar");

  if (request.status !== "pending") throw new Error("Solicitação já foi processada");

  await db.collection("groupMembers").add({
    groupId: request.groupId,
    userId: request.userId,
    role: "member",
  });

  await requestRef.update({ status: "approved" });

  await sendToUser(request.userId, "✅ Solicitação aprovada!", "Você foi aceito no grupo.");

  return { message: "Usuário aprovado" };
};

// 🔹 RECUSAR SOLICITAÇÃO

const rejectRequest = async (adminId, requestId) => {
  const requestRef = db.collection("joinRequests").doc(requestId);
  const requestDoc = await requestRef.get();

  if (!requestDoc.exists) throw new Error("Solicitação não encontrada");

  const request = requestDoc.data();

  const groupDoc = await db.collection("groups").doc(request.groupId).get();
  if (groupDoc.data().adminId !== adminId) throw new Error("Apenas admin pode recusar");

  if (request.status !== "pending") throw new Error("Solicitação já foi processada");

  await requestRef.update({ status: "rejected" });

  await sendToUser(request.userId, "❌ Solicitação recusada!", "Sua solicitação de entrada no grupo foi recusada.");

  return { message: "Solicitação recusada" };
};

// 🔹 DELETAR GRUPO (ADMIN ONLY)

const deleteGroup = async (adminId, groupId) => {
  const groupRef = db.collection("groups").doc(groupId);
  const groupDoc = await groupRef.get();

  if (!groupDoc.exists) throw new Error("Grupo não existe");
  if (groupDoc.data().adminId !== adminId) throw new Error("Apenas admin pode deletar o grupo");

  // Notifica todos os membros
  await sendToGroup(groupId, "❌ Grupo deletado!", `O grupo "${groupDoc.data().name}" foi encerrado pelo administrador.`);

  // Deleta todos os membros
  const membersSnap = await db.collection("groupMembers")
    .where("groupId", "==", groupId)
    .get();
  const batch = db.batch();
  membersSnap.docs.forEach(doc => batch.delete(doc.ref));

  // Deleta todos os lembretes
  const remindersSnap = await db.collection("reminders")
    .where("groupId", "==", groupId)
    .get();
  remindersSnap.docs.forEach(doc => batch.delete(doc.ref));

  // Deleta todos os resumos
  const summariesSnap = await db.collection("summaries")
    .where("groupId", "==", groupId)
    .get();
  summariesSnap.docs.forEach(doc => batch.delete(doc.ref));

  // Deleta o grupo
  batch.delete(groupRef);
  await batch.commit();

  return { message: "Grupo deletado com sucesso" };
};

// 🔹 ATUALIZAR NOME DO GRUPO
const updateGroupName = async (adminId, groupId, newName) => {
  if (!newName) throw new Error("Novo nome é obrigatório");

  const groupRef = db.collection("groups").doc(groupId);
  const groupDoc = await groupRef.get();

  if (!groupDoc.exists) throw new Error("Grupo não existe");
  if (groupDoc.data().adminId !== adminId) throw new Error("Apenas admin pode atualizar o grupo");

  await groupRef.update({ name: newName });

  return { message: "Nome do grupo atualizado com sucesso" };
};

// 🔹 LISTAR MEMBROS DO GRUPO
const getGroupMembers = async (userId, groupId) => {
  const memberCheck = await db.collection("groupMembers")
    .where("groupId", "==", groupId)
    .where("userId", "==", userId)
    .get();

  if (memberCheck.empty) throw new Error("Usuário não está nesse grupo");

  const snap = await db.collection("groupMembers")
    .where("groupId", "==", groupId)
    .get();

  const members = await Promise.all(snap.docs.map(async (doc) => {
    const memberId = doc.data().userId;
    let displayName = memberId;
    let email = "";
    try {
      const userRecord = await admin.auth().getUser(memberId);
      displayName = userRecord.displayName || userRecord.email || memberId;
      email = userRecord.email || "";
    } catch (e) {}

    return {
      userId: memberId,
      role: doc.data().role,
      name: displayName,
      email,
    };
  }));

  return members;
};

const getMyGroups = async (userId) => {
  const snap = await db.collection("groupMembers")
    .where("userId", "==", userId)
    .get();

  if (snap.empty) return [];

  const groups = await Promise.all(snap.docs.map(async (doc) => {
    const { groupId, role } = doc.data();
    const groupDoc = await db.collection("groups").doc(groupId).get();
    if (!groupDoc.exists) return null;

    const membersSnap = await db.collection("groupMembers")
      .where("groupId", "==", groupId)
      .get();
    const memberCount = membersSnap.size;

    return { ...groupDoc.data(), role, memberCount };
  }));

  return groups.filter(g => g !== null);
};

const getJoinRequests = async (userId, groupId) => {
  const groupDoc = await db.collection("groups").doc(groupId).get();
  if (!groupDoc.exists) throw new Error("Grupo não existe");
  if (groupDoc.data().adminId !== userId) throw new Error("Apenas admin pode ver solicitações");

  const snap = await db.collection("joinRequests")
    .where("groupId", "==", groupId)
    .where("status", "==", "pending")
    .get();

  return Promise.all(snap.docs.map(async (doc) => {
    const requestUserId = doc.data().userId;
    let displayName = requestUserId;
    let userEmail = "";
    try {
      const userRecord = await admin.auth().getUser(requestUserId);
      displayName = userRecord.displayName || userRecord.email || requestUserId;
      userEmail = userRecord.email || "";
    } catch (e) {}

    return {
      id: doc.id,
      requestId: doc.id,
      userId: requestUserId,
      userName: displayName,
      userEmail,
      groupId: doc.data().groupId,
      createdAt: doc.data().createdAt,
    };
  }));
};

module.exports = {
  createGroup, joinGroup, leaveGroup, removeUser, transferAdmin,
  generateInvite, joinByInvite, approveRequest, rejectRequest,
  deleteGroup, updateGroupName, getGroupMembers, getMyGroups,
  getJoinRequests
};