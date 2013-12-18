var inherits = require('util').inherits
  , EventEmitter = require('events').EventEmitter
  , _ = require('lodash')
  , throwUnless = require('power-throw').throwUnless
  , throwIf = require('power-throw').throwIf

var Room = function (name) {
  throwUnless("Must provide name for your room", name);
  this.users = []; 
  this.name = name;
  this.emit('init', this);
};

inherits(Room, EventEmitter);

Room.prototype.initialize = function () {
  this.emit('init', this);
  return this;
};

Room.prototype.addUser = function (user) {
  var userNotUnique = _.any(this.users, {id: user.id});

  throwIf("user already in room!", userNotUnique);
  this.users.push(user);
  user.room = this;
  this.emit("userJoined", this, user);
  return this;
};

Room.prototype.removeUser = function (user) {
  var user = _.find(this.users, {id: user.id});

  _.remove(this.users, user);
  user.room = null; 
  this.emit("userLeft", this, user);
  return this;
};

Room.prototype.getUsers = function () {
  return this.users;
};

Room.prototype.tick = function () {
  this.emit('tick', this, this.users);
  return this;
};

module.exports = Room;
