var uuid = require('node-uuid')
  , throwUnless = require('power-throw').throwUnless;

/**
UserMixin is intended to be used as a mixin!
For example, using node's util.inherits
and node-uuid

var CustomUser = function (socket, inventory, level) {
  this.id = uuid.v4();
  this.inventory = inventory;
  this.level = level;
  UserMixin.call(this, socket);
};

See tests for examples
*/
var UserMixin = function (socket, name) {
  throwUnless("must provide socket instance to UserMixin constructor", socket);
  this.id = this.id || uuid.v4();
  this.name = this.name || name || "Player";
  this.socket = socket;
};

UserMixin.prototype.toJSON = function () {
  return {
    id: this.id,
    name: this.name
  };
};

UserMixin.prototype.message = function (name, data) {
  this.socket.emit(name, data);
};

module.exports = UserMixin;
