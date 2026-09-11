const { db } = require("../config/firebaseAdmin");


// 🔹 INICIAR SESSÃO

const startSession = async (userId, groupId) => {
  // Verifica se o usuário está no grupo
  const memberSnap = await db.collection("groupMembers")
    .where("groupId", "==", groupId)
    .where("userId", "==", userId)
    .get();

  if (memberSnap.empty) {
    throw new Error("Usuário não está nesse grupo");
  }

  // Verifica se já tem uma sessão ativa
  const activeSnap = await db.collection("studySessions")
    .where("userId", "==", userId)
    .where("groupId", "==", groupId)
    .where("active", "==", true)
    .get();

  if (!activeSnap.empty) {
    const doc = activeSnap.docs[0];
    await doc.ref.update({ active: false, endTime: new Date()});
  }

  const session = {
    userId,
    groupId,
    startTime: new Date(),
    active: true,
  };

  const docRef = await db.collection("studySessions").add(session);

  return { sessionId: docRef.id, startTime: session.startTime };
};


// 🔹 FINALIZAR SESSÃO

const stopSession = async (userId, groupId) => {
  const snap = await db.collection("studySessions")
    .where("userId", "==", userId)
    .where("groupId", "==", groupId)
    .where("active", "==", true)
    .get();

  if (snap.empty) {
    throw new Error("Nenhuma sessão ativa encontrada");
  }

  const doc = snap.docs[0];
  const session = doc.data();

  const endTime = new Date();
  const duration = Math.floor((endTime - session.startTime.toDate()) / 1000);

  // Atualiza a sessão
  await doc.ref.update({
    endTime,
    duration,
    active: false,
  });

  // 🔹 Chave do dia: userId_groupId_YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];
  const dailyKey = `${userId}_${groupId}_${today}`;

  // 🔹 Chave do mês: userId_groupId_YYYY-MM
  const month = today.slice(0, 7);
  const monthlyKey = `${userId}_${groupId}_${month}`;

  // 🔹 Atualiza tempo diário
  const dailyRef = db.collection("dailyStudyTime").doc(dailyKey);
  const dailyDoc = await dailyRef.get();
  const currentDaily = dailyDoc.exists ? dailyDoc.data().totalTime || 0 : 0;

  await dailyRef.set({
    userId,
    groupId,
    date: today,
    totalTime: currentDaily + duration,
  });

  // 🔹 Atualiza tempo mensal
  const monthlyRef = db.collection("monthlyStudyTime").doc(monthlyKey);
  const monthlyDoc = await monthlyRef.get();
  const currentMonthly = monthlyDoc.exists ? monthlyDoc.data().totalTime || 0 : 0;

  await monthlyRef.set({
    userId,
    groupId,
    month,
    totalTime: currentMonthly + duration,
  });

  return {
    duration,
    dailyTotal: currentDaily + duration,
    monthlyTotal: currentMonthly + duration,
  };
};

module.exports = { startSession, stopSession };