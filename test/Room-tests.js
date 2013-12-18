var isArray = require('util').isArray
  , EventEmitter = require('events').EventEmitter
  , _ = require('lodash')
  , test = require('tape')
  , Room = require('./../src/Room')

test("Room constructs a new instance and inherits from EventEmitter", function (t) {
  t.plan(3);

  var room = new Room("test");

  t.ok(typeof Room === "function", "Room is a constructor");
  t.ok(typeof room === "object", "new Room returns an instance");
  t.ok(room instanceof EventEmitter, "room is an instance of EventEmitter");
});

test("Room should have several default properties defined", function (t) {
  t.plan(2);

  var name = "test"
    , room = new Room(name)

  t.ok(isArray(room.users), "users is an array");
  t.ok(room.name === "test", "name assigned to instance"); 
});

test("Room should throw if no name is provided", function (t) {
  t.plan(1);

  t.throws(function () {
    new Room; 
  });
});

//initialize
test("initialize should emit an 'init' event with self as argument", function (t) {
  t.plan(1);

  var testRoom = new Room("test")

  testRoom.on("init", function (room) {
    t.same(testRoom, room, "room passed to init handler");
  });

  testRoom.initialize();
});

//addUser
test("addUser should throw if a user with the same id is already in it", function (t) {
  t.plan(1);

  var room = new Room("test");

  room.addUser({id: 1});

  t.throws(function () {
    room.addUser({id: 1}); 
  });
});

test("addUser should add a room attribute to the user that is itself", function (t) {
  t.plan(1);

  var room = new Room("test")
    , user = {id: 1}

  room.addUser(user);

  t.same(user.room, room, "reference to room injected onto user");
});

test("addUser should emit a 'userJoined' event with signature user, room, params...", function (t) {
  t.plan(2);

  var testRoom = new Room("test")
    , testUser = {id: 1}

  testRoom.on("userJoined", function (room, user) {
    t.same(testUser, user, "user passed to userJoined handler");
    t.same(testRoom, room, "room passed to userJoined handler");
  });
  testRoom.addUser(testUser);
});

//removeUser
test("removeUser should set the room attribute of the user to null", function (t) {
  t.plan(1);

  var room = new Room("test")
    , user = {id: 1}

  room.addUser(user);
  room.removeUser(user);

  t.same(user.room, null, "reference to room removed from user");
});

test("removeUser should emit a 'userLeft' event with signature user, room, params...", function (t) {
  t.plan(2);

  var testRoom = new Room("test")
    , testUser = {id: 1}

  testRoom.on("userLeft", function (room, user) {
    t.same(testUser, user, "user passed to userLeft handler");
    t.same(testRoom, room, "room passed to userLeft handler");
  });
  testRoom.addUser(testUser);
  testRoom.removeUser(testUser);
});

test("getUsers should return the users as an array", function (t) {
  t.plan(2);

  var room = new Room("test")
    , testUser = {id: 1}
    , users = room.addUser(testUser).getUsers();

  t.ok(isArray(users), "returns an array of users");
  t.ok(_.contains(users, testUser), "array of users contains the correct users");
});
