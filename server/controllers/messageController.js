const Message = require("../models/messageModel");
const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

//Send a message
const sendMessage = async (req, res) => {
  const { conversation_id, user_id, content, is_agent_message } = req.body;
  try {
    const conversationExists = await Conversation.exists({
      _id: conversation_id,
    });
    const userExists = await User.exists({ _id: user_id });
    if (!conversationExists || !userExists) {
      return res.status(404).json({ error: "Conversation or user not found" });
    }

    const message = await Message.create({
      conversation_id,
      user_id,
      content,
      is_agent_message,
      timestamp: new Date(),
    });
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// get chat history
const getChatHistory = async (req, res) => {
  //TODO apply pagination
  const { conversationId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    return res.status(404).json({ error: "No valid id" });
  }
  const messages = await Message.find({
    conversation_id: conversationId,
  }).sort({ timestamp: 1 });
  res.status(200).json(messages);
};

module.exports = { sendMessage, getChatHistory };
