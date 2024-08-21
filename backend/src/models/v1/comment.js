const mongoose = require("mongoose");
const schema = mongoose.Schema({
  postid: { type: mongoose.Schema.Types.ObjectId, ref: "post", required: true },
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }], // اضافه کردن فیلد لایک
},
  { timestamps: true });

const model = mongoose.model("comment", schema);
module.exports = model;
