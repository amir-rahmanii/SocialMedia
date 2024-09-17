const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  participants: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      username: String,
      profilePicture: {
        path: String,
        filename: String,
      },
    }
  ],
  lastMessage: {
    content: String,  // متن آخرین پیام
    timestamp: Date,  // زمان ارسال آخرین پیام
    sender: {
      _id: mongoose.Schema.Types.ObjectId,
      username: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('room', roomSchema);