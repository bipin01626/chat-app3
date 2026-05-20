const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// static folder
app.use(express.static("public"));

// FIX: root route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

let users = [];

io.on("connection", (socket) => {

  // only 2 users
  if (users.length >= 2) {
    socket.emit("full", "Only 2 users allowed ❌");
    socket.disconnect();
    return;
  }

  let userName = users.length === 0 ? "Me" : "User";

  users.push({ id: socket.id, name: userName });

  io.emit("users", users.map(u => u.name));

  socket.on("chat message", (msg) => {
    io.emit("chat message", {
      user: userName,
      message: msg
    });
  });

  socket.on("disconnect", () => {
    users = users.filter(u => u.id !== socket.id);
    io.emit("users", users.map(u => u.name));
  });

});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log("Server running on " + PORT));