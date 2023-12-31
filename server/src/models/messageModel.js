const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  conversation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  is_customer_message: {
    type: Boolean,
    default: true,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
