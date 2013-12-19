var _ = require('lodash')
  , throwUnless = require('power-throw').throwUnless
  , Room = require('./Room')

var RoomManager = function (server, lobby) {
  throwUnless("Must provide server to RoomManager constructor", server);
  throwUnless("Must provide lobby to RoomManager constructor", lobby);
  this.rooms = {};
  this.lobby = lobby;
  this.server = server;
  this.socketToUserMap = {};
};

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
  this.server.server.close();
  return this;
};

module.exports = RoomManager;
