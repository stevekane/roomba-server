var socketIO = require('socket.io')
  , UserMixin = require('./src/UserMixin')
  , Room = require('./src/Room')
  , RoomManager = require('./src/RoomManager');

//Create a User Model
var User = function (socket, name) {
  UserMixin.call(this, socket, name);
};

//create our websocket server
var server = socketIO.listen(8080);

server.sockets.on("connection", function (socket) {
  socket.emit('yay'); 
});

//create lobby instance
var lobby = new Room("Lobby");

//create room manager and pass in our socketserver and lobby
var rm = new RoomManager(server, lobby);
