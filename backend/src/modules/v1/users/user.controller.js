const userValidator = require("./user.validation");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const mongoose = require('mongoose');
const { systemInfoMiddleware } = require('../../../middlewares/systemInfo');
const userModel = require("../../../models/v1/user");
const postModel = require("../../../models/v1/post");
const saveModel = require("../../../models/v1/savePost");
const likeToggleModel = require("../../../models/v1/likeToggle");
const commentModel = require("../../../models/v1/comment");
const messageModel = require("../../../models/v1/message");
const followToggleModel = require("../../../models/v1/followToggle");
const storyModel = require("../../../models/v1/story");
const ticketModel = require("../../../models/v1/ticket");
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
  const systemInfo = req.systemInfo || {};

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

    if (!req.file) {
      throwError("Profile picture is required", 400); // بررسی اینکه آیا کاربر تصویر آپلود کرده است
    }

    const isUserExist = await userModel
      .findOne({
        $or: [{ email }, { username }],
      })
      .lean();
    if (isUserExist) {
      throwError("email or username is exist", 401);
    }
    const isFirstUser = (await userModel.countDocuments()) === 0;

    // حذف 'public' از مسیر فایل
    const profilePath = req.file.path.replace(/^public[\\\/]/, "");

    // ایجاد کاربر جدید
    let user = new userModel({
      email,
      username,
      name,
      password,
      role: isFirstUser ? "ADMIN" : "USER",
      profilePicture: {
        path: profilePath, // تنظیم مسیر فایل آپلود شده بدون 'public'
        filename: req.file.filename,
      },
    });
    user = await user.save();

    // اضافه کردن اطلاعات سیستم به آرایه systemInfos
    await userModel.updateOne(
      { _id: user._id },
      {
        $push: {
          systemInfos: {
            $each: [{
              os: systemInfo.os,
              browser: systemInfo.browser,
              country: systemInfo.country,
              ip: systemInfo.ip,
              date: new Date()
            }],
            $position: 0
          }
        }
      }
    );

    const accessToken = accessTokenCreator(user, "365d");
    const refreshToken = await RefreshTokenModel.createToken(user);

    res.cookie("access-token", accessToken, {
      maxAge: 3_600_000, // 1 ساعت
      httpOnly: false,
    });
    res.cookie("refresh-token", refreshToken, {
      maxAge: 604_800_000, // 1 هفته
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
  const systemInfo = req.systemInfo || {}; // اطلاعات سیستم را از میدلویر بگیرید
  try {
    await userValidator.logInUserValidator.validate({ identity, password });
    const user = await userModel
      .findOne({ $or: [{ email: identity }, { username: identity }] })
      .lean();

    if (!user) {
      throwError("User not found", 404);
    }

    // بررسی وضعیت isban
    if (user.isban) {
      throwError("User is banned", 403); // یا هر کد خطای مناسب دیگر
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throwError("Email or password is incorrect", 401);
    }

    const accessToken = accessTokenCreator(user, "365d");
    const refreshToken = await RefreshTokenModel.createToken(user);

    // اضافه کردن اطلاعات سیستم به آرایه systemInfos
    await userModel.updateOne(
      { _id: user._id },
      {
        $push: {
          systemInfos: {
            $each: [{
              os: systemInfo.os,
              browser: systemInfo.browser,
              country: systemInfo.country,
              ip: systemInfo.ip,
              date: new Date()
            }],
            $position: 0
          }
        }
      }
    );

    res.cookie("access-token", accessToken, {
      maxAge: 3_600_000, // 1 ساعت
      httpOnly: false,
    });
    res.cookie("refresh-token", refreshToken, {
      maxAge: 604_800_000, // 1 هفته
      httpOnly: false,
    });

    return successResponse(res, 200, {
      message: "User logged in successfully :))",
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

    const accessToken = accessTokenCreator(user, "365d");
    const newRefreshToken = await RefreshTokenModel.createToken(user);

    res.cookie("access-token", accessToken, {
      maxAge: 3_600_000, // 1 ساعت
      httpOnly: false,
    });
    res.cookie("refresh-token", newRefreshToken, {
      maxAge: 604_800_000, // 1 هفته
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
       <p>${process.env.FRONT_URL}/reset-password/?token=${resetPassordToken}</p>
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
    const userId = req.user._id;
    req.body.userid = userId;

    const user = await userValidator.userInformation(req);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const postCount = await postModel.countDocuments({ 'user.id': userId });


    const newUser = {
      ...user.toObject(), // تبدیل به شیء جاوا اسکریپت
      postCount,
    }


    res.status(200).json(newUser);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
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
    // Update profile picture in all messages sent by the user
    await messageModel.updateMany(
      { "sender._id": userId },
      {
        $set: {
          "sender.profilePicture.path": filePath,
          "sender.profilePicture.filename": file.filename,
        },
      }
    );

    // Update profile picture in the likedBy array within messages
    await messageModel.updateMany(
      { "likedBy._id": userId },
      {
        $set: {
          "likedBy.$[elem].profilePicture.path": filePath,
          "likedBy.$[elem].profilePicture.filename": file.filename,
        },
      },
      {
        arrayFilters: [{ "elem._id": userId }],
      }
    );

    // After updating profile picture in other collections
    await ticketModel.updateMany(
      { "user.userId": userId },
      {
        $set: {
          "user.profilePicture.path": filePath,
          "user.profilePicture.filename": file.filename,
        },
      }
    );

    // Update profile picture in ticket responses
    await ticketModel.updateMany(
      { "responses.senderId": userId },
      {
        $set: {
          "responses.$[elem].senderProfilePicture.path": filePath,
          "responses.$[elem].senderProfilePicture.filename": file.filename,
        },
      },
      {
        arrayFilters: [{ "elem.senderId": userId }],
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

    // بررسی اینکه آیا userid یک ObjectId معتبر است یا خیر
    if (!mongoose.Types.ObjectId.isValid(userid)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // پیدا کردن کاربر با توجه به userid
    const user = await userModel.findById(userid).select('-password'); // حذف رمز عبور از اطلاعات برگردانده شده

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // پیدا کردن پست‌های مرتبط با کاربر و populate کردن اطلاعات liked و comment
    const posts = await postModel.find({ 'user.id': userid })
      .populate('likes') // پر کردن اطلاعات مربوط به لایک‌ها
      .populate('comments'); // پر کردن اطلاعات مربوط به کامنت‌ها

    // پیدا کردن استوری‌های مرتبط با کاربر
    const stories = await storyModel.find({ 'user.id': userid }).populate('media').exec();

    // تنظیم مقدار isSaved به false برای تمامی پست‌ها
    posts.forEach(post => {
      post.isSaved = false;
    });

    // برگرداندن اطلاعات کاربر، پست‌ها و استوری‌های او
    res.json({
      user,
      posts,
      stories
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.followToggle = async (req, res) => {
  try {
    const { userIdToFollow } = req.body; // Get userId from request body
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

      return res.status(200).json({
        message: "Unfollowed successfully.",
        user: {
          currentUser: {
            id: currentUser._id,
            username: currentUser.username,
            profilePicture: currentUser.profilePicture,
            following: currentUser.following // تعداد افرادی که کاربر دنبال می‌کند
          },
          userToFollow: {
            id: userToFollow._id,
            username: userToFollow.username,
            profilePicture: userToFollow.profilePicture,
            followers: userToFollow.followers // تعداد دنبال‌کنندگان
          }
        }
      });
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
          currentUser: {
            id: currentUser._id,
            username: currentUser.username,
            profilePicture: currentUser.profilePicture,
            following: currentUser.following, // تعداد افرادی که کاربر دنبال می‌کند
          },
          userToFollow: {
            id: userToFollow._id,
            username: userToFollow.username,
            profilePicture: userToFollow.profilePicture,
            followers: userToFollow.followers // تعداد دنبال‌کنندگان
          }
        }
      });
    }
  } catch (err) {
    res.status(500).json({ message: "An error occurred.", error: err.message });
  }
};




exports.getAllUsersInformation = async (req, res) => {
  try {
    // Retrieve all users' information from the database
    const users = await userModel.find({}, '-password').sort({ createdAt: -1 }); // Exclude the password field

    // برای هر کاربر تعداد پست‌های مربوط به او را دریافت کنید
    const usersWithPostCount = await Promise.all(users.map(async (user) => {
      const postCount = await postModel.countDocuments({ 'user.id': user._id }) || 0; // اگر تعداد پست‌ها صفر باشد
      return {
        ...user.toObject(), // تبدیل به شیء جاوا اسکریپت
        postCount, // اضافه کردن تعداد پست‌ها
      };
    }));

    return res.status(200).json(usersWithPostCount);
  } catch (error) {
    errorResponse(res, error.statusCode || 500, { message: error.message });
  }
};





exports.changeRole = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Toggle role between USER and ADMIN
    if (user.role === "ADMIN") {
      user.role = "USER";
    } else if (user.role === "USER") {
      user.role = "ADMIN";
    }

    await user.save();

    return res.status(200).json({ message: `User role successfully changed to ${user.role}`, user });
  } catch (err) {
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
}


exports.deleteUser = async (req, res) => {
  const { userId } = req.body;

  try {
    // یافتن و حذف کاربر
    const user = await userModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await userModel.updateMany(
      {
        $or: [
          { "followers.userId": userId },
          { "following.userId": userId }
        ]
      },
      {
        $pull: {
          followers: { userId: userId },
          following: { userId: userId }
        }
      }
    );

    // حذف تمام پست‌های کاربر
    await postModel.deleteMany({ 'user.id': userId });

    // حذف تمام پیام‌های کاربر
    await messageModel.deleteMany({ 'sender._id': userId });

    // حذف تمام استوری‌های کاربر
    await storyModel.deleteMany({ 'user.id': userId });

    // حذف تمام تیکت‌های کاربر
    await ticketModel.deleteMany({ "user.userId": userId });

    await commentModel.deleteMany({ userid: userId });


    await saveModel.deleteMany({ userid: userId });

    await likeToggleModel.deleteMany({ userid: userId });


    await followToggleModel.deleteMany({
      $or: [
        { userId: userId },    // حذف کاربر از دنبال‌شونده‌ها
        { followedBy: userId } // حذف کاربر از دنبال‌کننده‌ها
      ]
    });

    await forgetPasswordModel.deleteMany({ user: userId });

    await RefreshTokenModel.deleteMany({ user: userId });

    return res.status(200).json({ message: "User and related data deleted successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};



