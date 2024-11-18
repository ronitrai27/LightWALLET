const http = require("http");
const express = require("express");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Socket.io
io.on("connection", (socket) => {
  socket.on("user-message", (message) => {
    io.emit("message", message);
  });
});

app.use(express.static(__dirname)); 


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'community.html')); 
});

const localIP = '172.21.60.243'; 
server.listen(9000, localIP, () => console.log(`Server running at http://${localIP}:9000`));

