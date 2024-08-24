const mongoose = require("mongoose");
const schema = mongoose.Schema(
  {
    media: {
      path: { type: String, required: true },
      filename: { type: String, required: true },
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    hashtags: { type: String, required: true },
    user: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      username: { type: String, required: true },
      email: { type: String, required: true },
      name: { type: String, required: true },
      role: { type: String, required: true },
      isban: { type: Boolean, required: true },
      userPicture: {
        path: { type: String, required: true },
        filename: { type: String, required: true }
      }
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "likeToggle" }],
    saved: [{ type: mongoose.Schema.Types.ObjectId, ref: "saveposts" }],
    isSaved: { type: Boolean, default: false }, // New field with default value
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("post", schema);
module.exports = model;
