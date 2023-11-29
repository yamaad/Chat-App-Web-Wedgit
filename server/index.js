require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const socket = require("socket.io");

const userManagementRoutes = require("./routes/userManagement");
const conversationManagementRoutes = require("./routes/conversationManagement");
const agentManagementRoutes = require("./routes/agentManagement");
const messageManagementRoutes = require("./routes/messageManagement");

const app = express();

//middleware
//   cors middleware
app.use(cors());
//   logging middleware
app.use((req, res, next) => {
  // console.log(`Request: ${req.method} ${req.path}`);

  // // Store the original res.json and res.send methods
  // const originalJson = res.json;

  // // Override res.json to log the response body
  // res.json = function (body) {
  //   console.log("Response Body:", body);
  //   originalJson.call(this, body);
  // };

  next();
});
//   json middleware
app.use(express.json());
//   routes middlewares
app.use("/api/users", userManagementRoutes);
app.use("/api/conversations", conversationManagementRoutes);
app.use("/api/agents", agentManagementRoutes);
app.use("/api/messages", messageManagementRoutes);

// to control recursion
const delay = async (attempt) => {
  const delay = Math.pow(2, attempt) * 1000;
  console.log(`Retrying in ${delay / 1000} seconds...`);
  await new Promise((resolve) => setTimeout(resolve, delay));
};
//connect to DB
const connectDB = async (attempt = 1) => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "chatApp" });
  } catch (error) {
    console.error(
      `Connecting to db attempt#${attempt} failed, Error: ${error}`
    );
    await delay(attempt);
    return connectDB(attempt + 1);
  }
};
//initiate Express server
const initServer = async (attempt = 1) => {
  try {
    const server = app.listen(process.env.PORT, () => {
      console.log("server is listening on", process.env.PORT);
    });
    return server;
  } catch (error) {
    console.error(`starting server attempt#${attempt} failed, Error: ${error}`);
    await delay(attempt);
    return initServer(attempt + 1);
  }
};

//socket
const socketEvents = async (server) => {
  //initiate socket
  const io = socket(server, {
    cors: {
      origin: [process.env.CLIENT_HOST_URL, process.env.CUSTOMER_HOST_URL],
      methods: ["GET", "POST"],
    },
  });

  //connect socket
  io.on("connection", (socket) => {
    console.log("socket connect ", socket.id, socket.connected);
    socket.io = io;
    //to update agent if new customer started a conversation
    socket.on("agent_room", (agentId) => {
      socket.join(agentId);
    });

    // join a conversation
    socket.on("join_conversation", (conversation) => {
      socket.join(conversation._id);
      socket.to(conversation.agent_id).emit("new_conversation", conversation);
    });

    //send a message
    socket.on("send_message", (messageData) => {
      socket.io
        .in(messageData.conversation_id)
        .emit("receive_message", messageData);
    });

    //disconnect socket
    socket.on("disconnect", () => {
      console.log("socket connection ended for user: ", socket.id);
    });
  });
};

// start the application
const initApp = async () => {
  console.log("Connecting to db...");
  await connectDB();
  console.log("Connecting to db succeed");
  console.log("starting server...");
  const server = await initServer();
  socketEvents(server);
};

initApp();
