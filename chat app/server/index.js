const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./user");

const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", socket => {
  console.log("we have a new connection");
  socket.on("join", ({ name, room }, callback) => {
    //console.log(name, room);
    //function to add user to room
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) {
      return callback(error);
    }
    socket.join(user.room);

    //function to send ADMIN MESSAGE
    socket.emit("message", {
      user: "ADMIN",
      text: `${user.name}, WELCOME TO THE ROOM ${user.room}`
    });
    console.log(user.name, "has join! in room", user.room);
    socket.broadcast.to(user.room).emit("message", {
      user: "ADMIN",
      text: `${user.name}, has joined! Lets Welcome ${user.name}`
    });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room)
    });
    callback();
    //const error = true;
    // if (error) {
    //   callback({ error: "Error in joining" });
    // }
  });
  //to get the user who have joined and have send message
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    //y vahi message ha jo user na bhaja ha jo ham room ma dekha raha ha
    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });

  //to display the messsage user has left the room
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    // console.log(`${socket.id} has Left`);

    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has Left`
      });
      console.log(user.name, "has left! room", user.room);
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  });
});

app.use(cors());
app.use(router);

server.listen(PORT, () => console.log(`Server has started on PORT ${PORT}`));
