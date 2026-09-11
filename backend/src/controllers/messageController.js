const { createMessage, listMessages, voteOnPoll, deleteMessage } = require("../services/messageService");

const create = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { groupId, text, poll } = req.body;
    const result = await createMessage(userId, groupId, text, poll);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const list = async (req, res) => {
  try {
    const { groupId } = req.params;
    const result = await listMessages(groupId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const vote = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { messageId } = req.params;
    const { option } = req.body;
    const result = await voteOnPoll(userId, messageId, option);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { messageId } = req.params;
    const result = await deleteMessage(userId, messageId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { create, list, vote, remove };