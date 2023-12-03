require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const socket = require("socket.io");
const app = express();
mongoose.connect(process.env.MONGO_URI, { dbName: "chatApp" });
const server = app.listen(process.env.PORT, () => {
  console.log("server is listening on", process.env.PORT);
});
//initiate socket
const io = socket(server, {
  cors: {
    origin: [process.env.CLIENT_HOST_URL, process.env.CUSTOMER_HOST_URL],
    methods: ["GET", "POST"],
  },
});
app.set("io", io);
const userRoutes = require("./src/routes/userRouter");
const conversationRoutes = require("./src/routes/conversationRouter");
const agentRoutes = require("./src/routes/agentRouter");
const messageRoutes = require("./src/routes/messageRouter");
const organizationRoutes = require("./src/routes/organizationRouter");

//middleware
//   cors middleware
app.use(cors());
//   logging middleware
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.path}`);

  // Store the original res.json and res.send methods
  const originalJson = res.json;

  // Override res.json to log the response body
  res.json = function (body) {
    console.log("Response Body:", body);
    originalJson.call(this, body);
  };

  next();
});
//   json middleware
app.use(express.json());
//   routes middlewares
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/organizations", organizationRoutes);
//socket
//TODO: transfer this function to a new file socket.js
const lastMessageSent = {};
//connect socket
//TODO: separate them and make a function for each
io.on("connection", (socket) => {
  socket.io = io;

  //to update agent if new customer started a conversation
  socket.on("agent_room", (agentId) => {
    socket.join(agentId);
  });
  // join a conversation
  socket.on("join_conversation", (conversation) => {
    socket.join(conversation._id);
    socket.to(conversation.agent_id).emit("new_conversation", conversation);
    if (!lastMessageSent.hasOwnProperty(conversation._id)) {
      lastMessageSent[conversation._id] = Date.now();
    }
    console.log("join_conversation");
  });

  //send a message
  socket.on("receive_message", (messageData) => {
    lastMessageSent[messageData.conversation_id] = Date.now();
  });
  //disconnect socket
  socket.on("disconnect", () => {
    console.log("socket connection ended for user: ", socket.id);
  });
});

setInterval(() => {
  const now = Date.now();
  for (const roomId in lastMessageSent) {
    const lastActivityTime = lastMessageSent[roomId];
    const remainingTime =
      process.env.SESSION_TIMEOUT - (now - lastActivityTime);
    const remainingSeconds = Math.floor(remainingTime / 1000);
    io.in(roomId).emit("remaining_time", remainingSeconds);
    if (now - lastActivityTime >= process.env.SESSION_TIMEOUT) {
      console.log(`Conversation ${roomId} timed out.`);
      // Notify room members that the conversation has ended
      //TODO: fix: if client page is not open the patch request `.../api/conversations/:conversationId` will not be triggered
      io.in(roomId).emit("end_conversation", roomId);
      //Make all sockets in the room leave the room
      io.in(roomId).socketsLeave(roomId);
      // remove ended conversation from lastMessageSent
      delete lastMessageSent[roomId];
      console.log("after time out lastMessageSent:", lastMessageSent);
    }
  }
}, 1000);


