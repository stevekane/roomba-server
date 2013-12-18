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

//when a use establishes a connection do this:
rm.on("user-start", function (socket, data) {
  var user = new User(socket, {name: "new-guy"});

  rm.getLobby().addUser(user); 
  console.log('userStart fired');
  socket.emit('roomba-start-confirm', user);
});

//when a connection is re-established do this:
rm.on("user-resume", function (socket, data) {
  console.log("resumed!");
  //DO STUFF...
});

rm.on("user-disconnect", function (socket, data) {
  console.log("disconnected!");
  //DO STUFF...
});
