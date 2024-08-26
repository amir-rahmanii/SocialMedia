const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      },
      message: "Please enter a valid email address.",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  biography: {
    type: String,
  },
  profilePicture: {
    path: { 
      type: String, 
      required: true, 
      default: "images/profiles/default.jpg" 
    },
    filename: { 
      type: String, 
      required: true, 
      default: "default.jpg" 
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
  isban: {
    type: Boolean,
    default: false,
  },
  followers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    username: {
      type: String,
    },
    profilePicture: {
      path: String,
    },
  }],
  following: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    username: {
      type: String,
    },
    profilePicture: {
      path: String,
    },
  }],
}, {
  timestamps: true,
});

// Pre-save hook to hash password before saving
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("user", userSchema);
