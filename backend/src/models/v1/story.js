const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    media: [
      {
        path: { type: String, required: true },
        filename: { type: String, required: true },
      }
    ],
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
  },
  {
    timestamps: true,
    expires: '24h', // خودکار حذف شدن بعد از ۲۴ ساعت
  }
);

const model = mongoose.model("story", schema);
module.exports = model;
