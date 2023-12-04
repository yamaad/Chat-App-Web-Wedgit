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

const lastMessageSent = {};
//connect socket

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
  });
  socket.on("reset_timer", (conversation_id) => {
    lastMessageSent[conversation_id] = Date.now();
  });
  //disconnect socket
  socket.on("disconnect", () => {});
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
      // Notify room members that the conversation has ended

      io.in(roomId).emit("end_conversation", roomId);
      //Make all sockets in the room leave the room
      io.in(roomId).socketsLeave(roomId);
      // remove ended conversation from lastMessageSent
      delete lastMessageSent[roomId];
    }
  }
}, 1000);


