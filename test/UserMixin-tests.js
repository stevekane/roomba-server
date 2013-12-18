var isArray = require('util').isArray
  , _ = require('lodash')
  , test = require('tape')
  , UserMixin = require('./../src/UserMixin')

test("UserMixin constructs a new instance", function (t) {
  t.plan(2);

  var user = new UserMixin("test", {});

  t.ok(typeof UserMixin === "function", "UserMixin is a constructor");
  t.ok(typeof user === "object", "new UserMixin returns an instance");
});

test("UserMixin should be throw if name and socket not provided", function (t) {
  t.plan(1);

  t.throws(function () {
    new UserMixin;
  });
});

test("UserMixin should assign attributes name and socket with provided args", function (t) {
  t.plan(2);

  var name = "test-user"
    , socket = {}
    , user = new UserMixin(socket);

  t.same(user.socket, socket, "provided socket instance assigned"); 
  t.ok(typeof user.id === "string", "id assigned by constructor");
});

/**
User Mixin is intended to be mixed into your own User objects.
Its sole purpose is to provide you with a mechanism for assigning
a socket to each of the users in your system.  
*/

//New Constructor which mixes in our UserMixin
var FakeUser = function (socket, username, level) {
  this.username = username;
  this.level = level;
  UserMixin.call(this, socket);
};

//FakeUser tests
test("FakeUser should assign a socket object to the instance", function (t) {
  t.plan(2);

  var socket = {}
    , fu = new FakeUser(socket, 'stevens', 99);

  t.same(fu.socket, socket, "sock instance assigned to the object via mixin");
  t.ok(typeof fu.id === "string" , "user recievers random id if none explictly assigned");
});

//Constructor that assigns 4 to 'id' (for testing...obviously stupid)
var DiffUser = function (socket) {
  this.id = 4;
  UserMixin.call(this, socket);
};

test("DiffUser should have id of 4 and NOT one assigned by UserMixin", function (t) {
  t.plan(1);

  var socket = {}
    , du = new DiffUser(socket);

  t.same(4, du.id, "id of user instance is assigned by the object mixing it in");
});
