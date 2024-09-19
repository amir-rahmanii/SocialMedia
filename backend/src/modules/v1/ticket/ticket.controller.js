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


exports.getUserTicket = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming userId is extracted from the JWT token

    console.log(userId);

    // Fetch the user's tickets
    const tickets = await Ticket.find({ "user.userId": userId });

    // If no tickets are found, return an empty array with status 200
    if (!tickets || tickets.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(tickets.reverse());
  } catch (error) {
    res.status(500).json({ message: "An error occurred." });
  }
};



exports.respondTicket = async (req, res) => {
  try {
    const { ticketId } = req.body;
    const { message } = req.body;

    // بررسی خالی نبودن message
    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "message cannot be empty." });
    }

    // استخراج userId، username و role از کاربر احراز هویت‌شده (JWT)
    const userId = req.user._id;
    const username = req.user.username;
    const profilePicture = req.user.profilePicture;
    const role = req.user.role; // فرض بر این است که نقش (role) در JWT موجود است

    // یافتن تیکت با ID
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    // اضافه کردن پاسخ جدید به آرایه responses
    const newResponse = {
      senderId: userId,
      senderUsername: username,
      senderProfilePicture: profilePicture,
      message: message,
      responseDate: new Date(),
    };

    ticket.responses.push(newResponse);

    // تغییر وضعیت تیکت به "Answered" فقط در صورتی که پاسخ‌دهنده ادمین باشد
    if (role === "admin") {
      ticket.status = "Answered";
    }

    // ذخیره‌سازی تیکت به‌روزرسانی شده
    const updatedTicket = await ticket.save();

    res.status(200).json({ message: "Response added successfully.", ticket: updatedTicket });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while responding to the ticket.", error });
  }
};




exports.updateRating = async (req, res) => {
  try {
      const { ticketId } = req.body;
      const { rating } = req.body;

      // بررسی وجود rating و نوع داده صحیح
      if (typeof rating !== 'string' || isNaN(Number(rating)) || Number(rating) < 0 || Number(rating) > 5) {
          return res.status(400).json({ status: 400, success: false, error: 'Invalid rating. It should be a string between "0" and "5".' });
      }

      // پیدا کردن تیکت و به‌روزرسانی rating
      const updatedTicket = await Ticket.findByIdAndUpdate(
          ticketId,
          { rating: rating.toString() }, // اطمینان از اینکه مقدار rating به صورت رشته ذخیره شود
          { new: true }
      );

      if (!updatedTicket) {
          return res.status(404).json({ status: 404, success: false, error: 'Ticket not found.' });
      }

      res.status(200).json({ status: 200, success: true, ticket: updatedTicket });
  } catch (error) {
      console.error('Error updating ticket rating:', error.message);
      res.status(500).json({ status: 500, success: false, error: 'Server error.', details: error.message });
  }
}



