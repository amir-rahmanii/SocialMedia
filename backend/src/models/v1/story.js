const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    media: [{ type: mongoose.Schema.Types.ObjectId, ref: "mediaStory" }], // ارتباط با mediaStory
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
    expiresAt: {
      type: Date,
      default: () => Date.now() + 24 * 60 * 60 * 1000, // ۲۴ ساعت بعد از زمان ایجاد
      index: { expires: '24h' }, // TTL index برای حذف خودکار بعد از ۲۴ ساعت
    },
  },
  {
    timestamps: true, // افزودن createdAt و updatedAt به story
  }
);

const model = mongoose.model("story", schema);
module.exports = model;
