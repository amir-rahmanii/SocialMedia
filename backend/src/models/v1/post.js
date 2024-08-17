const mongoose = require("mongoose");
const schema = mongoose.Schema({
  media: {
    path: { type: String, required: true },
    filename: { type: String, required: true },
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  hashtags: { type: [String], required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "likeToggle" }],
});
const model = mongoose.model("post", schema);
module.exports = model;
