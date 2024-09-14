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
    const { ticketId } = req.params;
    const { messageBack } = req.body;

    // بررسی خالی نبودن messageBack
    if (!messageBack || messageBack.trim() === "") {
      return res.status(400).json({ message: "MessageBack cannot be empty." });
    }

    // Extract adminId and adminUsername from the authenticated user (JWT)
    const adminId = req.user.userId;
    const adminUsername = req.user.username;
    const adminProfilePicture = req.user.profilePicture;

    // Find the ticket by ID
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    // Update the response field
    const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, {
      response: {
        adminId,
        adminUsername,
        messageBack,
        adminProfilePicture,
        responseDate: new Date(),
      },
      status: "Answered"
    }, { new: true });

    res.status(200).json({ message: "Response added successfully.", ticket: updatedTicket });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while responding to the ticket.", error });
  }
};

