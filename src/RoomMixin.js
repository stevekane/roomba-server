var inherits = require('util').inherits
  , EventEmitter = require('events').EventEmitter
  , uuid = require('node-uuid')
  , _ = require('lodash')
  , throwUnless = require('power-throw').throwUnless
  , throwIf = require('power-throw').throwIf

var RoomMixin = function (name) {
  throwUnless("Must provide name for your room", name);
  this.users = []; 
  this.id = uuid.v4();
  this.name = name;
};

inherits(RoomMixin, EventEmitter);

RoomMixin.prototype.addUser = function (user) {
  var userNotUnique = _.any(this.users, {id: user.id});

  throwIf("user already in room!", userNotUnique);
  this.users.push(user);
  user.room = this;
  this.emit("userJoined", this, user);
  return this;
};

RoomMixin.prototype.removeUser = function (user) {
  var user = _.find(this.users, {id: user.id});

  _.remove(this.users, user);
  user.room = null; 
  this.emit("userLeft", this, user);
  return this;
};

RoomMixin.prototype.getUsers = function () {
  return this.users;
};

//probably will be overwritten for most classes
RoomMixin.prototype.tick = function () {
  this.emit('tick', this, this.users);
  return this;
};

module.exports = RoomMixin;
