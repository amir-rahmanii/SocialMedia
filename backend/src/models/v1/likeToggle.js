const mongoose = require("mongoose");
const schema = mongoose.Schema(
  {
    postid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
      required: true,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    userPicture: {
      path: { type: String, required: true },
      filename: { type: String, required: true }
    },
    username: { type: String, required: true }, // Added username field
  },
  { timestamps: true }
);
const model = mongoose.model("likeToggle", schema);
module.exports = model;
