var isArray = require('util').isArray
  , EventEmitter = require('events').EventEmitter
  , _ = require('lodash')
  , test = require('tape')
  , RoomMixin = require('./../src/RoomMixin')

test("RoomMixin constructs a new instance and inherits from EventEmitter", function (t) {
  t.plan(3);

  var room = new RoomMixin("test");

  t.ok(typeof RoomMixin === "function", "RoomMixin is a constructor");
  t.ok(typeof room === "object", "new RoomMixin returns an instance");
  t.ok(room instanceof EventEmitter, "room is an instance of EventEmitter");
});

test("RoomMixin should have several default properties defined", function (t) {
  t.plan(3);

  var name = "test"
    , room = new RoomMixin(name)

  t.ok(isArray(room.users), "users is an array");
  t.ok(room.name === "test", "name assigned to instance"); 
  t.ok(typeof room.id === "string", "id assigined to instance");
});

test("RoomMixin should throw if no name is provided", function (t) {
  t.plan(1);

  t.throws(function () {
    new RoomMixin; 
  });
});

//addUser
test("addUser should throw if a user with the same id is already in it", function (t) {
  t.plan(1);

  var room = new RoomMixin("test");

  room.addUser({id: 1});

  t.throws(function () {
    room.addUser({id: 1}); 
  });
});

test("addUser should add a room attribute to the user that is itself", function (t) {
  t.plan(1);

  var room = new RoomMixin("test")
    , user = {id: 1}

  room.addUser(user);

  t.same(user.room, room, "reference to room injected onto user");
});

test("addUser should emit a 'userJoined' event with signature user, room, params...", function (t) {
  t.plan(2);

  var testRoomMixin = new RoomMixin("test")
    , testUser = {id: 1}

  testRoomMixin.on("userJoined", function (room, user) {
    t.same(testUser, user, "user passed to userJoined handler");
    t.same(testRoomMixin, room, "room passed to userJoined handler");
  });
  testRoomMixin.addUser(testUser);
});

//removeUser
test("removeUser should set the room attribute of the user to null", function (t) {
  t.plan(1);

  var room = new RoomMixin("test")
    , user = {id: 1}

  room.addUser(user);
  room.removeUser(user);

  t.same(user.room, null, "reference to room removed from user");
});

test("removeUser should emit a 'userLeft' event with signature user, room, params...", function (t) {
  t.plan(2);

  var testRoomMixin = new RoomMixin("test")
    , testUser = {id: 1}

  testRoomMixin.on("userLeft", function (room, user) {
    t.same(testUser, user, "user passed to userLeft handler");
    t.same(testRoomMixin, room, "room passed to userLeft handler");
  });
  testRoomMixin.addUser(testUser);
  testRoomMixin.removeUser(testUser);
});

test("getUsers should return the users as an array", function (t) {
  t.plan(2);

  var room = new RoomMixin("test")
    , testUser = {id: 1}
    , users = room.addUser(testUser).getUsers();

  t.ok(isArray(users), "returns an array of users");
  t.ok(_.contains(users, testUser), "array of users contains the correct users");
});
