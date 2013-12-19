var uuid = require('node-uuid')
  , throwUnless = require('power-throw').throwUnless;

var UserMixin = function (socket, name) {
  throwUnless("must provide socket instance to UserMixin constructor", socket);
  this.id = this.id || uuid.v4();
  this.name = this.name || name || "Player";
  this.socket = socket;
};

UserMixin.prototype.message = function (name, data) {
  this.socket.emit(name, data);
};

module.exports = UserMixin;
