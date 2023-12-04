const Message = require("../models/messageModel");
const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const axios = require("axios");
const Organization = require("../models/organizationModel");

//Send a message
const sendMessage = async (req, res, io) => {
  const { conversation_id, user_id, content, is_customer_message } = req.body;
  try {
    const conversation = await Conversation.findById(conversation_id);
    const userExists = await User.exists({ _id: user_id });
    if (!conversation || !userExists) {
      return res.status(404).json({ error: "Conversation or user not found" });
    }
    const message = await Message.create({
      conversation_id,
      user_id,
      content,
      is_customer_message,
      timestamp: new Date(),
    });
    if (message) {
      io.in(conversation_id).emit("receive_message", message);
      await Conversation.findByIdAndUpdate(message.conversation_id, {
        last_message_at: new Date(),
      });
    }
    if (conversation.chatbot_type === "systemChatbot") {
      const chatbotResponse = await axios.post(
        process.env.OPENAI_API_URL,
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: content }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );
      const reply = await Message.create({
        conversation_id,
        user_id,
        content: chatbotResponse.data.choices[0].message.content,
        is_customer_message: false,
        timestamp: new Date(),
      });
      if (reply) {
        io.in(conversation_id).emit("receive_message", reply);
      }
    }
    if (conversation.chatbot_type === "organizationChatbot") {
      const organization = await Organization.findOne();
      const chatbotResponse = await axios.post(
        organization.chatbot_URL,
        {
          sender: user_id,
          messages: content,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${organization.chatbot_token}`,
          },
        }
      );
      const replyContent =
        chatbotResponse.data.find((response) => response.text)?.text ||
        "unknown chatbot response structure!";
      const reply = await Message.create({
        conversation_id,
        user_id,
        content: replyContent,
        is_customer_message: false,
        timestamp: new Date(),
      });
      if (reply) {
        io.in(conversation_id).emit("receive_message", reply);
      }
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// get chat history
const getChatHistory = async (req, res) => {
  const { conversationId } = req.params;
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || Number.MAX_SAFE_INTEGER;
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    return res.status(404).json({ error: "No valid id" });
  }
  const messages = await Message.aggregate([
    {
      $match: { conversation_id: new mongoose.Types.ObjectId(conversationId) },
    },
    { $sort: { timestamp: -1 } },
    { $skip: skip },
    { $limit: limit },
    { $sort: { timestamp: 1 } },
  ]);
  res.status(200).json(messages);
};

module.exports = { sendMessage, getChatHistory };
