// imports
const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
const Message = require("./models/v1/message"); // اطمینان از درست بودن مسیر
const User = require("./models/v1/user"); // اطمینان از درست بودن مسیر
const cors = require('cors');


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

// Running the server and setting up WebSocket
function startServer() {
  const port = process.env.PORT || 4002;
  const server = http.createServer(app);

  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173", // آدرس فرانت‌اند
      methods: ["GET", "POST"]
    }
  });


  io.on("connection", async (socket) => {
    console.log("A user connected");
  
    try {
      // یافتن و ارسال تمام پیام‌های موجود در دیتابیس به کاربر متصل شده
      const messages = await Message.find().populate("sender", "username profilePicture");
      socket.emit("initial messages", messages);
    } catch (err) {
      console.error("Error fetching messages from database:", err);
    }
  
    // گوش دادن به پیام جدید
    socket.on("chat message", async (msg) => {
      try {
        // یافتن کاربر برای دریافت نام کاربری و عکس پروفایل
        const user = await User.findById(msg.senderId);
  
        if (!user) {
          return socket.emit("error", "User not found");
        }
  
        // ذخیره پیام در دیتابیس
        const newMessage = new Message({
          sender: {
            _id: user._id,
            username: user.username,
            profilePicture: user.profilePicture, // فرض می‌کنیم user.profilePicture شامل path است
          },
          content: msg.content,
          timestamp: new Date(),
        });
        await newMessage.save();
  
        // ارسال پیام به تمام کاربران متصل
        io.emit("chat message", newMessage);
      } catch (err) {
        console.error(err);
      }
    });
  
    // رویداد قطع اتصال
    socket.on("disconnect", () => {
      console.log("User disconnected");
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
