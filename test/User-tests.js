var isArray = require('util').isArray
  , EventEmitter = require('events').EventEmitter
  , _ = require('lodash')
  , test = require('tape')
  , User = require('./../src/User')

test("User constructs a new instance and inherits from EventEmitter", function (t) {
  t.plan(3);

  var user = new User("test", {});

  t.ok(typeof User === "function", "User is a constructor");
  t.ok(typeof user === "object", "new User returns an instance");
  t.ok(user instanceof EventEmitter, "user is an instance of EventEmitter");
});

test("User should be throw if name and socket not provided", function (t) {
  t.plan(3);

  t.throws(function () {
    new User;
  });
  t.throws(function () {
    new User("test");
  });
  t.throws(function () {
    new User("", {});
  });
});

test("User should assign attributes name and socket with provided args", function (t) {
  t.plan(2);

  var name = "test-user"
    , socket = {}
    , user = new User(name, socket);

  t.same(user.socket, socket, "provided socket instance assigned"); 
  t.same(user.name, name, "provided name assigned"); 
});
