const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  followedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  followedAt: {
    type: Date,
    default: Date.now
  }
});

const model = mongoose.model("followToggle", schema);
module.exports = model;