const userValidator = require("./user.validation");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userModel = require("../../../models/v1/user");
const postModel = require("../../../models/v1/post");
const likeToggleModel = require("../../../models/v1/likeToggle");
const commentModel = require("../../../models/v1/comment");
const followToggleModel = require("../../../models/v1/followToggle");
const storyModel = require("../../../models/v1/story");
const path = require('path');
const RefreshTokenModel = require("../../../models/v1/refreshToken");
const {
  successResponse,
  errorResponse,
  throwError,
} = require("../../../utils/response");
const {
  accessTokenCreator,
  accessTokenExpiredTimeValidator,
} = require("../../../utils/jwtCreator");
const nodeMailer = require("nodemailer");

const forgetPasswordModel = require("../../../models/v1/forgetPassword");
// ------>

exports.register = async (req, res) => {
  const { email, username, name, password, confirmPassword } = req.body;
  try {
    await userValidator.registerUserVakidator.validate(
      {
        email,
        username,
        name,
        password,
        confirmPassword,
      },
      {
        abortEarly: false,
      }
    );

    const isUserExist = await userModel
      .findOne({
        $or: [{ email }, { username }],
      })
      .lean();
    if (isUserExist) {
      throwError("email or username is exist", 401);
    }
    const isFirstUser = (await userModel.countDocuments()) === 0;

    // --------------
    let user = new userModel({
      email,
      username,
      name,
      password,
      role: isFirstUser ? "ADMIN" : "USER",
    });
    user = await user.save();
    const accessToken = accessTokenCreator(user, "30s");
    const refreshToken = await RefreshTokenModel.createToken(user);

    res.cookie("access-token", accessToken, {
      maxAge: 900_000,
      httpOnly: false,
    });
    res.cookie("refresh-token", refreshToken, {
      maxAge: 900_000,
      httpOnly: false,
    });
    return successResponse(res, 201, {
      message: "User created successfully :))",
      user: { ...user.toObject(), password: undefined, userId: user._id, accessToken },
    });
  } catch (error) {
    return errorResponse(res, error.statusCode, { message: error.message });
  }
};

exports.login = async (req, res) => {
  const { identity, password } = req.body;
  try {
    await userValidator.logInUserValidator.validate({ identity, password });
    const user = await userModel
      .findOne({ $or: [{ email: identity }, { username: identity }] })
      .lean();
    if (!user) {
      throwError("user not found", 404);
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throwError("email or password is not true", 401);
    }

    const accessToken = accessTokenCreator(user, "30s");

    const refreshToken = await RefreshTokenModel.createToken(user);
    res.cookie("access-token", accessToken, {
      maxAge: 900_000,
      httpOnly: false,
    });
    res.cookie("refresh-token", refreshToken, {
      maxAge: 900_000,
      httpOnly: false,
    });

    return successResponse(res, 200, {
      message: "User login successfully :))",
      data: { ...user, password: undefined, accessToken },
    });
  } catch (error) {
    return errorResponse(res, error.statusCode, { message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const userId = await RefreshTokenModel.verifyToken(refreshToken);
    if (!userId) {
      throwError("refresh token not found or expired, please login", 400);
    }
    // Delete the refresh token document from the model
    await RefreshTokenModel.findOneAndDelete({ token: refreshToken });

    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      throwError("user not found, please login", 404);
    }

    const accessToken = accessTokenCreator(user, "30s");
    const newRefreshToken = await RefreshTokenModel.createToken(user);

    res.cookie("access-token", accessToken, {
      maxAge: 900_000, // 15 minutes
      httpOnly: false,
    });
    res.cookie("refresh-token", newRefreshToken, {
      maxAge: 900_000, // 15 minutes
      httpOnly: false,
    });

    return successResponse(res, 201, {
      message: "new access token is set",
      accessToken,
    });
  } catch (error) {
    return errorResponse(res, error.statusCode, { message: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  const { pervPassword, newPassword, newConfrimPassword } = req.body;
  try {
    const authorizationHeader = req.headers.authorization;
    await userValidator.updatePasswordValidator.validate(
      {
        pervPassword,
        newPassword,
        newConfrimPassword,
        authorizationHeader,
      },
      { abortEarly: false }
    );

    const decodedPayloadJwt = accessTokenExpiredTimeValidator(authorizationHeader);
    const userId = decodedPayloadJwt.userId;

    let user = await userModel.findOne({ _id: userId });
    const isPasswordMatch = await bcrypt.compare(pervPassword, user.password);
    if (!isPasswordMatch) {
      throwError("Current password does not match", 401); // 401 Unauthorized
    }

    user.password = newPassword;
    user = await user.save();

    return successResponse(res, 201, {
      message: "Password reset successfully",
      user: { ...user.toObject(), password: undefined },
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // Handle token expired error specifically
      return errorResponse(res, 409, { message: "Token has expired" });
    }
    const statusCode = error.statusCode || 500;
    return errorResponse(res, statusCode, { message: error.message });
  }
};

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    await userValidator.forGetPasswordValidator.validate({ email: email });
    const user = await userModel.findOne({ email });
    if (!user) {
      throwError("user not found", 404);
    }
    const resetPassordToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpireTime = Date.now() + 60000 * 5; //5 min
    let forgetPasswordDataInDb = new forgetPasswordModel({
      user: user._id,
      token: resetPassordToken,
      tokenExpireTime: resetTokenExpireTime,
    });

    forgetPasswordDataInDb = await forgetPasswordDataInDb.save();
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: "irantv70@gmail.com",
        pass: "jxrg txiu qbcf nbkd",
      },
    });
    const mailOptions = {
      from: "irantv70@gmail.com",
      to: email,
      subject: "Reset Password Link For Your Social account",
      html: `
       <h2>your link for reset password:</h2>
       <p>http://localhost:5173/reset-password/?token=${resetPassordToken}</p>
       `,
    };
    transporter.sendMail(mailOptions);

    return successResponse(res, 200, {
      message: " Password reset email sent successfully",
      data: email,
    });
  } catch (error) {
    return errorResponse(res, error.statusCode, { message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, new_password } = req.body;

  try {
    // اعتبارسنجی داده‌های ورودی
    await userValidator.resetPasswordValidator.validate(
      { token, new_password },
      { abortEarly: false }
    );

    // جستجوی توکن در پایگاه داده
    const resultResetSearchTokenInDb = await forgetPasswordModel.findOne({
      token,
      tokenExpireTime: { $gt: Date.now() }, // بررسی اعتبار زمانی توکن
    });
    if (!resultResetSearchTokenInDb) {
      throwError("Token not valid or expired", 401);
    }

    // پیدا کردن کاربر مرتبط با توکن
    const user = await userModel.findOne({
      _id: resultResetSearchTokenInDb.user,
    });
    if (!user) {
      throwError("User not found", 404);
    }

    // هش کردن رمز عبور جدید
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // بروزرسانی رمز عبور کاربر
    await userModel.findOneAndUpdate(
      { _id: user._id },
      { password: hashedPassword }
    );

    // حذف توکن از پایگاه داده
    await forgetPasswordModel.findOneAndDelete({
      _id: resultResetSearchTokenInDb._id,
    });

    // ارسال پاسخ موفقیت‌آمیز
    return successResponse(res, 200, {
      message: "Password reset successfully",
      data: "",
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res, 409, error, {});
  }
};

exports.userBanToggle = async (req, res) => {
  try {
    const { userid } = req.body;

    // اعتبارسنجی کاربر
    const user = await userValidator.banUserToAccess(req);

    // تغییر وضعیت بن کاربر
    const newBanStatus = !user.isban;
    await userModel.findByIdAndUpdate({ _id: userid }, { isban: newBanStatus });

    // به‌روزرسانی وضعیت بن در پست‌های کاربر
    await postModel.updateMany(
      { "user.id": userid },
      { $set: { "user.isban": newBanStatus } }
    );

    // ارسال پاسخ موفقیت
    successResponse(res, 201, {
      message: `The user was successfully ${newBanStatus ? "banned" : "unbanned"}`,
    });
  } catch (error) {
    errorResponse(res, error.statusCode || 500, { message: error.message });
  }
};

exports.userInformation = async (req, res) => {
  try {
    // Assume that the user ID is available in req.user (decoded from JWT)
    const userId = req.user._id;

    // Attach the userId to req.body for validation if necessary
    req.body.userid = userId;

    // Call the validator with the request
    const user = await userValidator.userInformation(req);

    successResponse(res, 200, { message: "User information retrieved successfully", user });
  } catch (error) {
    errorResponse(res, error.statusCode || 500, { message: error.message });
  }
};



exports.updateUserProfile = async (req, res) => {
  try {
    if (!req.file) {
      throwError("Media is required", 400);
    }

    const userId = req.user._id; // Assume the user is authenticated
    const file = req.file;

    // Correct the file path format
    const filePath = file.path.replace(/\\/g, "/").replace("public/", "");

    // Update the user's profile picture
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          "profilePicture.path": filePath,
          "profilePicture.filename": file.filename,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update profile picture in all posts by the user
    await postModel.updateMany(
      { "user.id": userId },
      {
        $set: {
          "user.userPicture.path": filePath,
          "user.userPicture.filename": file.filename,
        },
      }
    );

    // Update profile picture in all comments by the user
    await commentModel.updateMany(
      { userid: userId },
      {
        $set: {
          "userPicture.path": filePath,
          "userPicture.filename": file.filename,
        },
      }
    );

    // Update profile picture in all likes by the user
    await likeToggleModel.updateMany(
      { userid: userId },
      {
        $set: {
          "userPicture.path": filePath,
          "userPicture.filename": file.filename,
        },
      }
    );

    // Update profile picture in all followers
    await userModel.updateMany(
      { "followers.userId": userId },
      {
        $set: {
          "followers.$[elem].profilePicture": { path: filePath },
        },
      },
      {
        arrayFilters: [{ "elem.userId": userId }],
      }
    );

    // Update profile picture in all following
    await userModel.updateMany(
      { "following.userId": userId },
      {
        $set: {
          "following.$[elem].profilePicture": { path: filePath },
        },
      },
      {
        arrayFilters: [{ "elem.userId": userId }],
      }
    );

    // Update profile picture in all stories by the user
    await storyModel.updateMany(
      { "user.id": userId },
      {
        $set: {
          "user.userPicture.path": filePath,
          "user.userPicture.filename": file.filename,
        },
      }
    );

    res.status(200).json({ message: "Profile picture updated", user: updatedUser });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};



exports.userAllData = async (req, res) => {
  try {
    const { userid } = req.params;

    // پیدا کردن کاربر با توجه به userid
    const user = await userModel.findById(userid).select('-password'); // حذف رمز عبور از اطلاعات برگردانده شده

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // پیدا کردن پست‌های مرتبط با کاربر و populate کردن اطلاعات liked و comment
    const posts = await postModel.find({ 'user.id': userid })
      .populate('likes') // پر کردن اطلاعات مربوط به لایک‌ها
      .populate('comments'); // پر کردن اطلاعات مربوط به کامنت‌ها

    // تنظیم مقدار isSaved به false برای تمامی پست‌ها
    posts.forEach(post => {
      post.isSaved = false;
    });

    // برگرداندن اطلاعات کاربر و پست‌های او
    res.json({
      user,
      posts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.followToggle = async (req, res) => {
  try {
    const userIdToFollow = req.params.userId;
    const currentUserId = req.user._id;

    if (userIdToFollow === currentUserId.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }

    // Check if the user to follow exists
    const userToFollow = await userModel.findById(userIdToFollow);
    const currentUser = await userModel.findById(currentUserId);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the follow relationship already exists
    const existingFollow = await followToggleModel.findOne({
      userId: userIdToFollow,
      followedBy: currentUserId
    });

    if (existingFollow) {
      // Unfollow
      await followToggleModel.deleteOne({
        userId: userIdToFollow,
        followedBy: currentUserId
      });

      // Remove from both users' follow lists
      currentUser.following = currentUser.following.filter(follow => follow.userId.toString() !== userIdToFollow);
      userToFollow.followers = userToFollow.followers.filter(follower => follower.userId.toString() !== currentUserId.toString());

      await currentUser.save();
      await userToFollow.save();

      return res.status(200).json({ message: "Unfollowed successfully." });
    } else {
      // Follow
      const newFollow = new followToggleModel({
        userId: userIdToFollow,
        followedBy: currentUserId
      });
      await newFollow.save();

      // Add to both users' follow lists
      currentUser.following.push({
        userId: userToFollow._id,
        username: userToFollow.username,
        profilePicture: userToFollow.profilePicture
      });
      userToFollow.followers.push({
        userId: currentUser._id,
        username: currentUser.username,
        profilePicture: currentUser.profilePicture
      });

      await currentUser.save();
      await userToFollow.save();

      return res.status(200).json({
        message: "Followed successfully.",
        user: {
          id: userToFollow._id,
          username: userToFollow.username,
          profilePicture: userToFollow.profilePicture,
          followedAt: newFollow.followedAt
        }
      });
    }
  } catch (err) {
    console.error("Error in followToggle:", err);
    res.status(500).json({ message: "An error occurred.", error: err.message });
  }
};


exports.getAllUsersInformation = async (req, res) => {
  try {
    // Retrieve all users' information from the database
    const users = await userModel.find({}, '-password'); // Exclude the password field

    successResponse(res, 200, { message: "All users' information retrieved successfully", users });
  } catch (error) {
    errorResponse(res, error.statusCode || 500, { message: error.message });
  }
};



