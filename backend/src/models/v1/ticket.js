const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    department: {
        type: String,
        required: true,
        enum: ["Support", "Technical", "HR", "Management", "Design", "Other"], // Example departments
    },
    description: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 60
    },
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 25
    },
    user: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        profilePicture: {
            path: {
                type: String,
                required: true,
                default: "images/profiles/default.jpg",
            },
            filename: {
                type: String,
                required: true,
                default: "default.jpg",
            },
        },
    },
    status: {
        type: String,
        enum: ["Open", "Closed", "Answered"], // سه وضعیت: باز، بسته و پاسخ داده شده
        default: "Open", // پیش‌فرض: باز
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium",
    },
    responses: [{
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        senderUsername: {
            type: String,
            required: true,
        },
        senderProfilePicture: {
            path: {
                type: String,
                required: true,
                default: "images/profiles/default.jpg",
            },
            filename: {
                type: String,
                required: true,
                default: "default.jpg",
            },
        },
        message: {
            type: String,
            required: true,
        },
        responseDate: {
            type: Date,
            required : true
        }
    }],
    rating: {
        type: String,
        default: "0", // Default to 0
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("ticket", ticketSchema);
