const { admin, db } = require("../config/firebaseAdmin");
const { sendToUser } = require("./notificationService");


// 🔹 CRIAR RESUMO

const createSummary = async (userId, groupId, title, content) => {
  const memberSnap = await db.collection("groupMembers")
    .where("groupId", "==", groupId)
    .where("userId", "==", userId)
    .get();

  if (memberSnap.empty) {
    throw new Error("Usuário não está nesse grupo");
  }

  const summary = {
    userId,
    groupId,
    title,
    content,
    createdAt: new Date(),
  };

  const docRef = await db.collection("summaries").add(summary);
  await sendToUser(summary.userId, "💬 Novo comentário!", `Alguém comentou no seu resumo: ${summary.title}`);
  return { summaryId: docRef.id, ...summary };
};

// 🔹 LISTAR RESUMOS DO GRUPO

const listSummaries = async (userId, groupId) => {
  const memberSnap = await db.collection("groupMembers")
    .where("groupId", "==", groupId)
    .where("userId", "==", userId)
    .get();

  if (memberSnap.empty) {
    throw new Error("Usuário não está nesse grupo");
  }

  const snap = await db.collection("summaries")
    .where("groupId", "==", groupId)
    .get();

  const resumos = await Promise.all(snap.docs.map(async doc => {
    const data = doc.data();
    let authorName = "Usuário desconhecido";
  try {
    const userRecord = await admin.auth().getUser(data.userId);
    authorName = userRecord.displayName || userRecord.email || "Usuário desconhecido";
  } catch (e) {}
    return { summaryId: doc.id, ...data, authorName };
  }));


  return resumos;
};

// 🔹 VER RESUMO ESPECÍFICO

const getSummary = async (userId, summaryId) => {
  const doc = await db.collection("summaries").doc(summaryId).get();

  if (!doc.exists) {
    throw new Error("Resumo não encontrado");
  }

  const summary = doc.data();

  // Verifica se o usuário está no grupo do resumo
  const memberSnap = await db.collection("groupMembers")
    .where("groupId", "==", summary.groupId)
    .where("userId", "==", userId)
    .get();

  if (memberSnap.empty) {
    throw new Error("Usuário não está nesse grupo");
  }

  // Busca os comentários
  const commentsSnap = await db.collection("summaryComments")
    .where("summaryId", "==", summaryId)
    .get();

  const comments = await Promise.all(commentsSnap.docs.map(async doc => {
    const data = doc.data();
    let authorName = "Usuário desconhecido";
    try {
      const userRecord = await admin.auth().getUser(data.userId);
      authorName = userRecord.displayName || userRecord.email || "Usuário desconhecido";
    } catch (e) {}
    return { commentId: doc.id, ...data, authorName };
  }));

  return { summaryId: doc.id, ...summary, comments };
};

// 🔹 COMENTAR RESUMO

const commentSummary = async (userId, summaryId, text) => {
  const doc = await db.collection("summaries").doc(summaryId).get();

  if (!doc.exists) {
    throw new Error("Resumo não encontrado");
  }

  const summary = doc.data();

  const memberSnap = await db.collection("groupMembers")
    .where("groupId", "==", summary.groupId)
    .where("userId", "==", userId)
    .get();

  if (memberSnap.empty) {
    throw new Error("Usuário não está nesse grupo");
  }

  const comment = {
    summaryId,
    userId,
    text,
    createdAt: new Date(),
  };

  const commentRef = await db.collection("summaryComments").add(comment);
  return { commentId: commentRef.id, ...comment };
};


// 🔹 DELETAR RESUMO

const deleteSummary = async (userId, summaryId) => {
  const doc = await db.collection("summaries").doc(summaryId).get();

  if (!doc.exists) {
    throw new Error("Resumo não encontrado");
  }

  const summary = doc.data();

  // Verifica se é o criador
  if (summary.userId === userId) {
    await doc.ref.delete();
    return { message: "Resumo deletado" };
  }

  // Verifica se é admin do grupo
  const groupDoc = await db.collection("groups").doc(summary.groupId).get();
  if (groupDoc.data().adminId === userId) {
    await doc.ref.delete();
    return { message: "Resumo deletado pelo admin" };
  }

  throw new Error("Sem permissão para deletar esse resumo");
};

module.exports = { createSummary, listSummaries, getSummary, commentSummary, deleteSummary };