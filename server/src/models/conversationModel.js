const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const conversationSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  is_chatbot_assigned: {
    type: Boolean,
    required: true,
  },
  chatbot_type: {
    type: String,
    required: function () {
      return this.is_chatbot_assigned;
    },
  },
  agent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
    required: function () {
      return !this.is_chatbot_assigned;
    },
  },
  start_time: {
    type: Date,
    required: true,
  },
  last_message_at: {
    type: Date,
    required: true,
  },
  end_time: {
    type: Date,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
