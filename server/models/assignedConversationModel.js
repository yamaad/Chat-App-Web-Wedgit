const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const assignedConversationSchema = new Schema({
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => {
      return new mongoose.Types.ObjectId();
    },
    required: true,
    unique: true,
  },
  agent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
    required: true,
  },
  conversation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
});

const AssignedConversation = mongoose.model(
  "AssignedConversation",
  assignedConversationSchema
);

module.exports = AssignedConversation;
