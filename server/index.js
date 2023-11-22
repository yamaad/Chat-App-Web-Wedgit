const express = require("express");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

// cors middleware for socket io
app.use(cors());

//
const server = http.createServer(app);

//
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`socket connection initiated ${socket.id}`);

  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });
  socket.on("disconnect", () => {
    console.log(`disconnected ${socket.id}`);
  });
});

// listener
server.listen(process.env.PORT, () => {
  console.log("listening on port to server");
});
