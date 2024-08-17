const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  tokenExpireTime: {
    type: Date,
    required: true,
  },
});
const model = mongoose.model("ResetPassword", schema);
module.exports = model;
