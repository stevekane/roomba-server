var inherits = require('util').inherits
  , EventEmitter = require('events').EventEmitter
  , _ = require('lodash')
  , throwUnless = require('power-throw').throwUnless
  , throwIf = require('power-throw').throwIf

var User = function (name, socket) {
  throwUnless("Must provide name for your room", name);
  throwUnless("Must provide name for your room", socket);
  this.name = name;
  this.socket = socket;
};

inherits(User, EventEmitter);

User.prototype.initialize = function () {
  this.emit('init', this); 
};

module.exports = User;
