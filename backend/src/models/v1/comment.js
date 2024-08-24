const mongoose = require("mongoose");

const schema = mongoose.Schema({
  postid: { type: mongoose.Schema.Types.ObjectId, ref: "post", required: true },
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  username: { type: String, required: true }, // Added username field
  userPicture: {
    path: { type: String, required: true },
    filename: { type: String, required: true },
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
},
  { timestamps: true }
);

const model = mongoose.model("comment", schema);
module.exports = model;
