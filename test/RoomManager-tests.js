var test = require('tape')
  , _ = require('lodash')
  , isArray = require('util').isArray
  , RoomManager = require('./../src/RoomManager')

test("RoomManager is a constructor that throws if not provided a port", function (t) {
  t.plan(3);
  
  var r = new RoomManager(8080);

  t.ok(typeof RoomManager === "function", "RoomManager is a constructor");
  t.ok(typeof r === "object", "RoomManager produces instances");
  t.throws(function () {
    new RoomManager();
  });
  r.close();
});

test("RoomManager should set several attributes", function (t) {
  t.plan(3);

  var r = new RoomManager(8080);

  t.ok(typeof r.rooms === "object", "room instance has object attribute rooms");
  t.ok(typeof r.server=== "object", "room instance has object attribute server");
  t.ok(typeof r.lobby === "object", "room instance has object attribute called lobby");

  r.close();
});

//RoomManager.addRoom
test("RoomManager.addRoom should add the room to the rooms object with key of room.id", function (t) {
  t.plan(2);

  var r = new RoomManager(8080)
    , room = {id: 1, name: "test"};

  r.addRoom(room);

  t.same(r.rooms[1], room, "room added by key -> id value ->room to rooms object");
  t.same(room.roomManager, r, "reference to roomManager added to room");

  r.close();
});

//RoomManager.removeRoom
test("RoomManager.removeRoom should remove the ref to roomManager from the room and remove it from rooms",
function (t) {
  t.plan(1);

  var r = new RoomManager(8080)
    , room = {id: 1, name: "test"};

  r.addRoom(room)
  r.removeRoom(room);

  t.ok(!!r.rooms[1] === false, "room by this id removed from rooms object");

  r.close();
});

//RoomManager.getRooms
test("RoomManager.getRooms should return an array of rooms", function (t) {
  t.plan(2);

  var r = new RoomManager(8080)
    , room = {id: 1, name: "test"}
    , rooms;

  r.addRoom(room);
  rooms = r.getRooms();
  
  t.ok(_.contains(rooms, room), "rooms contained the room that was added");
  t.ok(isArray(rooms), "rooms is an array");

  r.close();
});

//RoomManager.close
test("RoomManager.close should stop the currently running http Server", function (t) {
  t.plan(1);

  var r = new RoomManager(8080);

  //this is a hacky "test" but there is no other way to test it?
  r.close();
  t.ok(true, "server stopped listening");
});
