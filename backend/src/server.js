// imports
const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
const Message = require("./models/v1/message"); // اطمینان از درست بودن مسیر

// load env
const productionMode = process.env.NODE_ENV === "production";
if (!productionMode) {
  dotenv.config();
}

// db connection
async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to database");
  } catch (error) {
    console.error(`Error connecting to DB: ${error}`);
    process.exit(1);
  }
}

// Define onlineUsers object
let onlineUsers = {};

// Running the server and setting up WebSocket
function startServer() {
  const port = process.env.PORT || 4002;
  const server = http.createServer(app);
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  // WebSocket logic
  io.on("connection", (socket) => {
    console.log("A user connected");

    // Handle user joining and tracking online status
    socket.on("userOnline", (userId) => {
      onlineUsers[userId] = socket.id;
      io.emit("onlineUsers", onlineUsers); // Send updated online users to all clients
    });

    // Handle user disconnecting and removing their online status
    socket.on("disconnect", () => {
      for (let userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
          io.emit("onlineUsers", onlineUsers); // Send updated online users to all clients
          break;
        }
      }
      console.log("A user disconnected");
    });

    // Join a room based on user ID
    socket.on("joinRoom", (userId) => {
      socket.join(userId);
    });

    // Handle message sending
    socket.on("sendMessage", async ({ fromUserId, toUserId, message }) => {
      try {
        const newMessage = new Message({
          fromUserId,
          toUserId,
          message,
        });

        await newMessage.save();

        // Send message to the recipient's room
        io.to(toUserId).emit("receiveMessage", newMessage);
      } catch (error) {
        console.error(`Error sending message: ${error}`);
      }
    });
  });

  server.listen(port, () => {
    console.log(
      `Server running in ${
        productionMode ? "production" : "development"
      } on port ${port}`
    );
  });
}

// Run server.js
async function run() {
  await connectToDb();
  startServer();
}
run();
