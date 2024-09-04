const mongoose = require("mongoose");
const { boolean } = require("yup");

const messageSchema = new mongoose.Schema({
  sender: {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    profilePicture: {
      path: String,
      filename: String,
    },
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  likedBy: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      username: String,
      profilePicture: {
        path: String,
        filename: String,
      },
    }
  ]
});

module.exports = mongoose.model("message", messageSchema);
