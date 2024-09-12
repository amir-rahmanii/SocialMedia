const Ticket = require("../../../models/v1/ticket"); // مسیر مدل تیکت
const User = require("../../../models/v1/user"); // مسیر مدل کاربر
const fs = require("fs");

exports.addNewTicket = async (req, res) => {
    const { department, description, title, userId, priority } = req.body;
  
    try {
      // پیدا کردن کاربر بر اساس userId
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "کاربر یافت نشد." });
      }
  
      // ایجاد تیکت جدید
      const newTicket = new Ticket({
        department,
        description,
        title,
        user: {
          userId: user._id,
          username: user.username,
          profilePicture: {
            path: user.profilePicture.path,
            filename: user.profilePicture.filename,
          },
        },
        priority: priority || "Medium", // اگر priority ارسال نشود، به صورت پیش‌فرض Medium انتخاب می‌شود
      });
  
      // ذخیره‌سازی تیکت جدید
      await newTicket.save();
  
      res.status(201).json({ message: "ticket created SuccessFuly.", ticket: newTicket });
    } catch (error) {
      res.status(500).json({ message: "error in created ticket.", error });
    }
  };
