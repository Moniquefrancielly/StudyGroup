const { db, admin } = require("../config/firebaseAdmin");
const { sendToGroup } = require("./notificationService");

//////////////////////////////////////////////////////
// 🔹 CRIAR RECADO
//////////////////////////////////////////////////////
const createMessage = async (userId, groupId, text, poll) => {
  const memberSnap = await db.collection("groupMembers")
    .where("groupId", "==", groupId)
    .where("userId", "==", userId)
    .get();

  if (memberSnap.empty) throw new Error("Usuário não está nesse grupo");

  if (!text || text.trim().length === 0) throw new Error("Texto é obrigatório");
  if (text.length > 500) throw new Error("Texto não pode ter mais de 500 caracteres");

  const userRecord = await admin.auth().getUser(userId);
  const authorName = userRecord.displayName || userRecord.email || userId;

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 semana

  const message = {
    groupId,
    userId,
    authorName,
    text,
    createdAt: new Date(),
    expiresAt,
    poll: poll ? {
      option1: { label: poll.option1, votes: [] },
      option2: { label: poll.option2, votes: [] },
    } : null,
  };

  const docRef = await db.collection("groupMessages").add(message);

  await sendToGroup(groupId, `📢 Novo recado de ${authorName}`, text.slice(0, 80));

  return { messageId: docRef.id, ...message };
};

//////////////////////////////////////////////////////
// 🔹 LISTAR RECADOS DO GRUPO
//////////////////////////////////////////////////////
const listMessages = async (groupId) => {
  const now = new Date();

  const snap = await db.collection("groupMessages")
    .where("groupId", "==", groupId)
    .get();

  const messages = snap.docs
    .map(doc => ({ messageId: doc.id, ...doc.data() }))
    .filter(msg => msg.expiresAt.toDate() > now);

  messages.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

  return messages;
};

//////////////////////////////////////////////////////
// 🔹 VOTAR EM ENQUETE
//////////////////////////////////////////////////////
const voteOnPoll = async (userId, messageId, option) => {
  if (option !== "option1" && option !== "option2") throw new Error("Opção inválida");

  const docRef = db.collection("groupMessages").doc(messageId);
  const doc = await docRef.get();

  if (!doc.exists) throw new Error("Recado não encontrado");
  if (!doc.data().poll) throw new Error("Este recado não tem enquete");

  const poll = doc.data().poll;

  // Remove voto anterior se existir
  poll.option1.votes = poll.option1.votes.filter((v) => v !== userId);
  poll.option2.votes = poll.option2.votes.filter((v) => v !== userId);

  // Adiciona novo voto
  poll[option].votes.push(userId);

  await docRef.update({ poll });

  return { message: "Voto registrado", poll };
};

//////////////////////////////////////////////////////
// 🔹 DELETAR RECADO
//////////////////////////////////////////////////////
const deleteMessage = async (userId, messageId) => {
  const doc = await db.collection("groupMessages").doc(messageId).get();

  if (!doc.exists) throw new Error("Recado não encontrado");

  const message = doc.data();

  if (message.userId === userId) {
    await doc.ref.delete();
    return { message: "Recado deletado" };
  }

  const groupDoc = await db.collection("groups").doc(message.groupId).get();
  if (groupDoc.data().adminId === userId) {
    await doc.ref.delete();
    return { message: "Recado deletado pelo admin" };
  }

  throw new Error("Sem permissão para deletar este recado");
};

module.exports = { createMessage, listMessages, voteOnPoll, deleteMessage };