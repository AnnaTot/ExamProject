import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import router from "./routes/users.js";
import { Console } from "console";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let onlineUserss = {};

io.on("connection", (socket) => {
  console.log("Új kapcsolat: ", socket.id);

  socket.on("userLogin", (username) => {
    onlineUserss[username] = socket.id;

    socket.broadcast.emit("userOnline", username);

    console.log("Online felhasználiülk:", onlineUserss);
  });

  socket.on(
    "register to the pritvateChat",
    (loggedInUserUsername, username_2) => {
      const privateRoomCode = [loggedInUserUsername, username_2]
        .sort()
        .join("-");
      console.log(privateRoomCode);
      console.log(loggedInUserUsername);

      socket.join(privateRoomCode);

      socket.on("send message to the privateChat", (message) => {
        io.to(privateRoomCode).emit(
          "private message send",
          message,
          loggedInUserUsername
        );
      });
    }
  );

  socket.on("register to the groupChat", (group_id, loggedInUsername) => {
    socket.join(group_id);
    socket.on("send message to the group", (message) => {
      console.log(`Group Chat ${group_id}`);
      console.log(message);

      io.to(group_id).emit("group message send", message, loggedInUsername);
      console.log(message);
      console.log(group_id);
    });
  });

  socket.on("Group Request", (username, toastRequest) => {
    console.log("Címzett: ", username);
    console.log("Toast üzenet:", toastRequest);

    io.to(onlineUserss[username]).emit("Recieve request", toastRequest);
  });

  socket.on("Banned user", (username, toestBanned, group_id) => {
    console.log(toestBanned);
    console.log(username);
    console.log("Group_id: ", group_id);

    io.to(onlineUserss[username]).emit(
      "Banned user send",
      toestBanned,
      group_id
    );
  });

  socket.on("userOffline register", (username) => {
    console.log(`User offlines: ${username}`);
    delete onlineUserss[username];
    io.emit("userOffline", username);
  });

  socket.on("accepted request", (accpetedRequest, username) => {
    console.log(accpetedRequest);
    console.log(username);

    io.to(onlineUserss[username]).emit("sent from backend", accpetedRequest);
  });

  socket.on("denied request", (deniedRequest, username) => {
    console.log("Frontendről kapott üzi: ", deniedRequest);
    console.log("Frontendről kapott id: ", username);

    io.to(onlineUserss[username]).emit("send denied request", deniedRequest);
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
