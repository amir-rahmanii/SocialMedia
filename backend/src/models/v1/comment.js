const mongoose = require("mongoose");
const schema = mongoose.Schema({
  postid: { type: mongoose.Schema.Types.ObjectId, ref: "post", require: true },
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "user", require: true },
  title: { type: String, require: true },
  content: { type: String, require: true },
});

const model = mongoose.model("comment", schema);
module.exports = model;
