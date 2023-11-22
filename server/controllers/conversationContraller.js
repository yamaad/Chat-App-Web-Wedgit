const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

//Start a new conversation
const startConversation = async (req, res) => {
  const { user_id } = req.body;
  try {
    const userExists = await User.exists({ _id: user_id });
    if (!userExists) {
      return res.status(404).json({ error: "Conversation or user not found" });
    }
    const conversation = await Conversation.create({
      user_id,
      start_time: new Date(),
    });
    res.status(200).json(conversation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// End conversation
const endConversation = async (req, res) => {
  const { conversationId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    return res.status(404).json({ error: "No valid id" });
  }
  try {
    const conversation = await Conversation.findByIdAndUpdate(conversationId, {
      end_time: new Date(),
      is_active: false,
    });
    if (!conversation) {
      return res.status(400).json({ error: "no conversation found" });
    }
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { startConversation, endConversation };
