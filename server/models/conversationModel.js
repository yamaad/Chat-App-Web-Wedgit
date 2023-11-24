const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  start_time: {
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
