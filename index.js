const express = require('express');
const app = express();
const http = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync("ssl.key/server.key"),
  cert: fs.readFileSync("ssl.crt/server.crt"),
};

const server = http.createServer(options, app);
const { Server } = require("socket.io");
const io = new Server(server);


app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
	console.log(socket)
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

   socket.broadcast.emit('hi');
});

io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets

server.listen(3000, () => {
  console.log('listening on *:3000');
});