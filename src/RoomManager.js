var EventEmitter = require('events').EventEmitter
  , inherits = require('util').inherits
  , engine = require('engine.io')
  , _ = require('lodash')
  , throwUnless = require('power-throw').throwUnless
  , Room = require('./Room')

/**
RoomManager a manager of rooms. 
-Manage rooms
-Create Lobby instance
-Wraps an engine.io server and wraps several custom socket events
 connection - > create a user using the socket object provided
 disconnect - > destroy the socket and user object.  remove them from rooms
*/
var RoomManager = function (port, options) {
  throwUnless("Must provide port to RoomManager constructor", port);
  var options = options || {}
    , server = options.server || engine.listen(port);

  this.rooms = {};
  this.lobby = options.lobby || new Room("Lobby");
  this.server = options.server || server;

  configSocketHandlers(server, this);
};

inherits(RoomManager, EventEmitter);

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

RoomManager.prototype.getRoomByName = function (name) {
  return _.chain(this.rooms)
          .values()
          .find({name: name})
          .value();
};

RoomManager.prototype.getLobby = function () {
  return this.lobby;
};

RoomManager.prototype.close = function () {
  this.server.httpServer.close();
  return this;
};

function configSocketHandlers (server, roomManager) {
  server.on("connection", function (socket) {
    socket.on("roomba-start", function (data) {
      console.log('git it');
      roomManager.emit('user-start', socket, data);
    });
    socket.on("roomba-resume", function (data) {
      roomManager.emit('user-resume', socket, data); 
    });
    socket.on("disconnect", function (data) {
      roomManager.emit('user-disconnect', socket, data); 
    });
    socket.send(JSON.stringify({message:"roomba-connected"}));
  });

  return server;
}

module.exports = RoomManager;
