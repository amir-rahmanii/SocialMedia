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

  const onlineUsers = new Set(); // برای ذخیره کاربران آنلاین
  const typingUsers = {}; // برای ردیابی کاربران در حال تایپ

  io.on("connection", async (socket) => {
    console.log("A user connected");

    // اضافه کردن کاربر به لیست آنلاین
    onlineUsers.add(socket.id);
    io.emit("online users", onlineUsers.size); // ارسال تعداد کاربران آنلاین به تمام کاربران

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
            profilePicture: user.profilePicture,
          },
          content: msg.content,
          timestamp: new Date(),
          seenBy: [], // اضافه کردن فیلد seenBy به پیام
        });
        await newMessage.save();

        // ارسال پیام به تمام کاربران متصل
        io.emit("chat message", newMessage);
      } catch (err) {
        console.error(err);
      }
    });

    // گوش دادن به رویداد "typing"
    socket.on("typing", (data) => {
      const { userId, username, isTyping } = data;
      if (isTyping) {
        typingUsers[userId] = { socketId: socket.id, username: username };
      } else {
        delete typingUsers[userId];
      }

      // ارسال لیست کاربران در حال تایپ به همه
      io.emit("typing users", Object.values(typingUsers).map(user => user.username));
    });

    // گوش دادن به رویداد "like message"
    socket.on("like message", async ({ msgId, userId }) => {
      try {
        // یافتن پیام با استفاده از ID
        const message = await Message.findById(msgId);
        if (!message) return;

        // یافتن اطلاعات کاربر با استفاده از ID
        const user = await User.findById(userId, '_id username profilePicture');
        if (!user) return;

        // بررسی اینکه آیا کاربر قبلاً پیام را لایک کرده است یا نه
        const userIndex = message.likedBy.findIndex(likedUser => likedUser._id.toString() === userId);

        if (userIndex > -1) {
          // اگر کاربر قبلاً پیام را لایک کرده باشد، لایک او را حذف کنید
          message.likedBy.splice(userIndex, 1);
        } else {
          // اگر کاربر هنوز پیام را لایک نکرده باشد، لایک او را اضافه کنید
          message.likedBy.push({
            _id: user._id,
            username: user.username,
            profilePicture: user.profilePicture
          });
        }

        // ذخیره پیام به‌روزرسانی شده
        await message.save();

        // ارسال به‌روزرسانی به همه کاربران متصل
        // ارسال به‌روزرسانی به همه کاربران متصل همراه با اطلاعات کاربر
        io.emit("message liked", {
          msgId,
          userId: user._id,
          username: user.username,
          profilePicture: user.profilePicture
        });
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("delete message", async (msgId) => {
      try {
          const message = await Message.findById(msgId);
          if (!message) return;
  
          await Message.deleteOne({ _id: msgId });
  
          // ارسال به‌روزرسانی به همه کاربران
          io.emit("message deleted", msgId);
      } catch (err) {
          console.error(err);
      }
  });

    // گوش دادن به رویداد "edit message"
    socket.on("edit message", async ({ msgId, newContent }) => {
      try {
        // یافتن پیام با استفاده از ID
        const message = await Message.findById(msgId);
        if (!message) return;
  
        // به‌روزرسانی محتوای پیام و تنظیم فیلد isEdited به true
        message.content = newContent;
        message.isEdited = true;
  
        // ذخیره پیام به‌روزرسانی شده
        await message.save();
  
        // ارسال پیام به‌روزرسانی شده به همه کاربران متصل
        io.emit("message edited", message);
      } catch (err) {
        console.error("Error editing message:", err);
      }
    });


    // رویداد قطع اتصال
    socket.on("disconnect", () => {
      console.log("User disconnected");
      onlineUsers.delete(socket.id); // حذف کاربر از لیست آنلاین
      io.emit("online users", onlineUsers.size); // ارسال تعداد کاربران آنلاین به تمام کاربران

      // حذف کاربر از لیست تایپ کنندگان در صورت قطع اتصال
      for (const [userId, user] of Object.entries(typingUsers)) {
        if (user.socketId === socket.id) {
          delete typingUsers[userId];
        }
      }

      // ارسال به‌روزرسانی لیست کاربران تایپ کننده
      io.emit("typing users", Object.values(typingUsers).map(user => user.username));
    });
  });





  server.listen(port, () => {
    console.log(
      `Server running in ${productionMode ? "production" : "development"
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
