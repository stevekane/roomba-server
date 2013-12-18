var UserMixin = require('./src/UserMixin')
  , Room = require('./src/Room')
  , RoomManager = require('./src/RoomManager')

//Create a User Model
var User = function (socket, name) {
  UserMixin.call(this, socket, name);
};

var rm = new RoomManager(8080)
  , room = new Room("example")

room.on("userJoined", function (room, user) {
  console.log(user.id, "joined", room.name);
});

rm.addRoom(room);

/**
When events come from the client, it will have a socket, a message, and
a json body.  

'connection' -> setup handlers
  'roomba-begin' -> create user, return that user to the socket
  'roomba-resume' -> lookup user with provided id, return it or create a new user
  '
*/
