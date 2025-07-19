const io = require("socket.io");

const server= io(3001, {
  cors: {
    origin: "*", //wildcard
    methods: ["GET", "POST"]
  }
});

const users = {};

server.on('connection', (socket) => {
  console.log('connected: ' + socket.id);

  socket.on('login', (nick) => {
    users[socket.id] = nick;
    socket.emit('loggedIn');
    server.emit('message', `${nick} has joined the chat.`);
    server.emit('users', Object.values(users));
  });

  socket.on('message', (message) => {
    const nick = users[socket.id];
    server.emit('message', `${nick}: ${message}`);
  });

  socket.on('disconnect', () => {
    const nick = users[socket.id];
    delete users[socket.id];
    if (nick) {
      server.emit('message', `${nick} has left the chat.`);
      server.emit('users', Object.values(users));
    }
  });
});
