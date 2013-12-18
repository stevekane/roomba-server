var engine = require('engine.io')
  , _ = require('lodash')
  , throwUnless = require('power-throw').throwUnless
  , throwIf = require('power-throw').throwIf
  , UserMixin = require('./UserMixin')
  , Room = require('./Room')

/**
RoomManager a manager of rooms. 

-Create/Delete rooms
-Wraps an engine.io server and wraps several custom socket events
 connection - > create a user using the socket object provided
 disconnect - > destroy the socket and user object.  remove them from rooms
*/
var RoomManager = function (port, options) {
  throwUnless("Must provide port to RoomManager constructor", port);
  var server = engine.listen(port, console.error.bind(console))
    , options = options || {};

  this.rooms = {};
  this.lobby = options.lobby || new Room("Lobby");
  this.User = options.User || UserMixin;
  this.server = options.server || server;

  configSocketHandlers(server, this);
};

RoomManager.prototype = Object.create({});

RoomManager.prototype.addRoom = function (room) {
  this.rooms[room.id] = room;
  room.roomManager = this;
  return this;
};

RoomManager.prototype.removeRoom = function (room) {
  var targetRoom = this.rooms[room.id];
  
  targetRoom.roomManager = null;
  delete this.rooms[room.id];
};

RoomManager.prototype.getRooms = function () {
  return _.values(this.rooms); 
};

RoomManager.prototype.close = function () {
  this.server.httpServer.close();
};

function configSocketHandlers (server, roomManager) {
  server.on("connection", function (socket) {
    socket.on("roomManager-start", function (data) {
      roomManager.emit('login', socket, data);
    });
    socket.on("roomManager-resume", function (data) {
      roomManager.emit('resume', socket, data); 
    });
    socket.on("disconnect", function (data) {
      roomManager.emit('disconnect', socket, data); 
    });
  });

  return server;
}

module.exports = RoomManager;
