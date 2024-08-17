const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expire: {
    type: Date,
    required: true,
  },
});

schema.statics.createToken = async (user) => {
  const expireInDays = process.env.REFRESH_JWT_EXP;
  const refreshToken = uuidv4();
  const refreshTokenDoc = new model({
    user: user._id,
    token: refreshToken,
    expire: new Date(Date.now() + expireInDays * 24 * 60 * 60 * 1000),
  });
  refreshTokenDoc.save();
  return refreshToken;
};
schema.statics.verifyToken = async (token) => {
  const refreshTokenDocument = await model.findOne({ token });

  if (refreshTokenDocument && refreshTokenDocument.expire >= Date.now()) {
    return refreshTokenDocument.user;
  } else {
    return null;
  }
};
const model = mongoose.model("RefreshToken", schema);

module.exports = model;
