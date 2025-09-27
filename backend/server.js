// backend/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 5000;

// Serve frontend
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Test API
app.get("/api", (req, res) => res.send("Backend running"));

// Socket.io connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (username) => {
    socket.username = username || "Anonymous";
    console.log(`${socket.username} joined`);
  });

  socket.on("chatMessage", (msgObj) => {
    // Send message to all users including sender
    io.emit("chatMessage", msgObj);
  });

  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

server.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
