const fs = require("fs");

const {
  errorResponse,
  successResponse,
  throwError,
} = require("../../../utils/response");
const postValidator = require("./postValidator");
const postModel = require("../../../models/v1/post");
const likeToggleModel = require("../../../models/v1/likeToggle");
const savepostsModel = require("../../../models/v1/savePost");
const commentModel = require("../../../models/v1/comment");
const userModel = require("../../../models/v1/user");
// ------------------->
exports.createPost = async (req, res) => {
  try {
    const user = req.user;
    const { title, description, hashtags } = req.body;
    await postValidator.createPostAccess(req, res);
    const mediaUrlPath = `images/posts/${req.file.filename}`;
    const post = new postModel({
      media: {
        path: mediaUrlPath,
        filename: req.file.filename,
      },
      title,
      description,
      hashtags,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        isban: user.isban,
        userPicture: user.profilePicture,
      }
    });
    await post.save();
    successResponse(res, 201, { message: "post created", post });
  } catch (error) {
    return errorResponse(res, error.statusCode, { message: error.message });
  }
};
exports.getAllPosts = async (req, res) => {
  try {
    // Update all posts to set isSaved to false
    await postModel.updateMany({}, { isSaved: false });

    // Retrieve all posts with isSaved set to false
    const allPosts = await postModel
      .find({}, { __v: 0 })
      .populate("comments", "-__v")
      .populate("likes", "-__v");

    successResponse(res, 200, { allPosts });
  } catch (error) {
    errorResponse(res, 500, { message: error.message, error });
  }
};

exports.myPosts = async (req, res) => {
  try {
    const user = req.user;

    // Update all user's posts to set isSaved to false
    await postModel.updateMany({ "user.id": user._id }, { isSaved: false });

    // Find posts related to the user
    const allPosts = await postModel
      .find({ "user.id": user._id }) // Match with user ID
      .populate("comments") // Populate comments data
      .populate("likes", "-__v") // Populate likes data without __v field
      .exec();

    // Log the results for inspection
    console.log("All Posts:", allPosts);

    successResponse(res, 200, { allPosts });
  } catch (error) {
    errorResponse(res, 500, { message: error.message, error });
  }
};


exports.searchPosts = async (req, res) => {
  try {
    const query = req.query.query;

    // تنظیم فیلد isSaved برای تمام پست‌ها به false
    await postModel.updateMany({}, { $set: { isSaved: false } });

    // ولیدیت کردن دسترسی جستجو
    postValidator.searchPostsAccess(req, res);

    // جستجوی پست‌ها با استفاده از regex
    const regex = new RegExp(query, "i");
    const resultSearch = await postModel
      .find({ title: { $regex: regex } })
      .populate("comments")
      .populate("likes", "-__v")
      .lean(); // استفاده از lean برای برگرداندن نتایج به شکل plain objects

    // تبدیل saved از ObjectId به String
    resultSearch.forEach(post => {
      post.saved = post.saved.map(userId => userId.toString());
    });

    successResponse(res, 200, { resultSearch });
  } catch (error) {
    errorResponse(res, error.statusCode, { message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postid } = req.body;
    await postValidator.deletePostsAccess(req, res);
    const resultPostDelete = await postModel.deleteOne({ _id: postid });
    if (resultPostDelete.deletedCount < 1) {
      throwError("post is not found", 404);
    }
    await commentModel.deleteMany({ postid });
    successResponse(res, 201, { message: "the post was deleted successfully" });
  } catch (error) {
    errorResponse(res, error.statusCode, { message: error.message });
  }
};
exports.updatePost = async (req, res) => {
  try {
    const { title, description, hashtags } = req.body;
    const user = req.user;

    // دریافت پست قبلی
    const existingPost = await postModel.findById(req.body.postid);

    await postValidator.updatePostsAccess(req, res);

    // اگر فایل جدیدی ارسال نشده بود، مسیر فایل قبلی را نگه می‌داریم
    let mediaUrlPath, filename;
    if (req.file) {
      mediaUrlPath = `images/posts/${req.file.filename}`;
      filename = req.file.filename;
    } else {
      mediaUrlPath = existingPost.media.path;
      filename = existingPost.media.filename;
    }

    const post = await postModel.findOneAndUpdate(
      { _id: req.body.postid },
      {
        media: {
          path: mediaUrlPath,
          filename: filename,
        },
        title,
        description,
        hashtags,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          isban: user.isban,
        }
      },
      { new: true } // برای بازگرداندن پست به‌روزرسانی شده
    );
    successResponse(res, 201, { message: "post updated", post });
  } catch (error) {
    if (req.file) {
      const mediaUrlPath = `public/images/posts/${req.file.filename}`;
      fs.unlink(mediaUrlPath, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }

    errorResponse(res, error.statusCode, { message: error.message });
  }
};
exports.likeToggle = async (req, res) => {
  try {
    const user = req.user;
    const { postid } = req.body;
    await postValidator.likeTogglePostsAccess(req, res);

    const likeToggleRecord = await likeToggleModel.findOne({
      userid: user._id,
      postid,
    });

    if (likeToggleRecord) {
      await likeToggleModel.deleteOne({
        userid: user._id,
        postid,
      });

      await postModel.updateOne(
        { _id: postid },
        {
          $pull: {
            likes: likeToggleRecord._id,
          },
        }
      );

      successResponse(res, 201, { message: "post is disLiked" });
    } else {
      // مقدار username را از user استخراج کنید
      let record = new likeToggleModel({
        userid: user._id,
        postid,
        username: user.username, // اضافه کردن username
        userPicture: {
          path: user.profilePicture.path,
          filename: user.profilePicture.filename,
        },
      });

      record = await record.save();

      await postModel.findByIdAndUpdate(postid, {
        $push: { likes: record._id },
      });

      successResponse(res, 201, { message: "post is liked" });
    }
  } catch (error) {
    errorResponse(res, error.statusCode || 500, { message: error.message }); // اطمینان از وجود statusCode
  }
};
exports.savePostToggle = async (req, res) => {
  try {
    const user = req.user;
    const { postid } = req.body;
    await postValidator.likeTogglePostsAccess(req, res);
    const savePostToggleRecord = await savepostsModel.findOne({
      userid: user._id,
      postid,
    });
    // ----------
    if (savePostToggleRecord) {
      await savepostsModel.deleteOne({
        userid: user._id,
        postid,
      });

      await postModel.updateOne(
        { _id: postid },
        {
          $pull: {
            saved: user._id, // تغییر در این خط
          },
        }
      );

      successResponse(res, 201, { message: "post is unsaved" });
    } else {
      const record = new savepostsModel({
        userid: user._id,
        postid,
      });

      await record.save();

      await postModel.findByIdAndUpdate(postid, {
        $push: { saved: user._id }, // تغییر در این خط
      });

      successResponse(res, 201, { message: "post is saved" });
    }
  } catch (error) {
    errorResponse(res, error.statusCode, { msg: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const user = req.user; // Assume `req.user` contains the authenticated user's info
    const { postid, title, content } = req.body;

    // Validate access to add a comment
    await postValidator.addCommentPostsAccess(req, res);

    // Retrieve user details to get the username
    const userData = await userModel.findById(user._id);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const username = userData.username; // Get the username

    // Create a new comment
    let comment = new commentModel({
      postid,
      userid: user._id,
      username, // Include the username
      userPicture: {
        path: user.profilePicture.path,
        filename: user.profilePicture.filename,
      },
      title,
      content,
    });

    // Save the comment
    comment = await comment.save();

    // Update the post with the new comment ID
    await postModel.findByIdAndUpdate(postid, {
      $push: { comments: comment._id },
    });

    // Send success response
    successResponse(res, 201, { message: "Comment submitted successfully" });
  } catch (error) {
    // Send error response
    errorResponse(res, error.statusCode || 500, { message: error.message });
  }
};
exports.deleteComment = async (req, res) => {
  try {
    const { commentid } = req.body;
    await postValidator.deleteCommentPostValidator(req, res);
    const resultDelete = await commentModel.deleteOne({ _id: commentid });
    if (resultDelete.deletedCount < 1) {
      throwError("comment is not found", 404);
    }
    successResponse(res, 201, { message: "comment deleted" });
  } catch (error) {
    errorResponse(res, error.statusCode, { message: error.message });
  }
};
exports.mySavePosts = async (req, res) => {
  try {
    const user = req.user;
    const mySavesRecord = await savepostsModel.find({ userid: user.id });
    let myPosts = [];

    for (const item of mySavesRecord) {
      const result = await postModel
        .findOneAndUpdate(
          { _id: item.postid },
          { isSaved: true }, // Set isSaved to true
          { new: true } // Return the updated document
        )
        .populate('comments') // Populate the comments array with full details
        .populate('likes')    // Populate the likes array with full details
        .populate('saved');   // Populate the saved array with full details

      if (result) {
        myPosts.push(result);
      }
    }

    successResponse(res, 200, { myPosts });
  } catch (error) {
    errorResponse(res, 500, { message: error.message });
  }
};

exports.postDetails = async (req, res) => {
  try {
    const { postid } = req.body;
    const result = await postModel
      .findOne({ _id: postid })
      .populate("comments") // پر کردن داده‌های کامنت‌ها
      .populate("likes", "-__v") // پر کردن داده‌های لایک‌ها بدون فیلد __v
      .populate("saved") // پر کردن داده‌های ذخیره‌شده

    if (result == null) {
      throwError("post is not found", 404);
    }
    successResponse(res, 200, { result });
  } catch (error) {
    errorResponse(res, error.statusCode, { message: error.message });
  }
};
