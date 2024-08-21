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
    
    // لاگ کردن شناسه کاربر برای اطمینان
    console.log("User ID:", user._id);

    // پیدا کردن پست‌های مرتبط با کاربر
    const allPosts = await postModel
      .find({ "user.id": user._id }) // استفاده از `user.id` برای مطابقت با شناسه کاربر
      .populate("comments") // پر کردن داده‌های کامنت‌ها
      .populate("likes", "-__v") // پر کردن داده‌های لایک‌ها بدون فیلد __v
      .populate("saved") // پر کردن داده‌های ذخیره‌شده
      .exec();

    // لاگ کردن نتایج برای بررسی
    console.log("All Posts:", allPosts);

    successResponse(res, 200, { allPosts });
  } catch (error) {
    errorResponse(res, 500, { message: error.message, error });
  }
};

exports.searchPosts = async (req, res) => {
  try {
    const query = req.query.query;
    postValidator.searchPostsAccess(req, res);
    const regex = new RegExp(query, "i");
    const resultSearch = await postModel
      .find({ title: { $regex: regex } })
      .populate("comments")
      .populate("likes", "-__v");

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
    await postValidator.updatePostsAccess(req, res);

    const mediaUrlPath = `images/posts/${req.file.filename}`;

    const post = await postModel.findOneAndUpdate(
      { _id: req.body.postid },
      {
        media: {
          path: mediaUrlPath,
          filename: req.file.filename,
        },
        title,
        description,
        hashtags,
        user: user._id,
      }
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
    // ----------
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
      let record = new likeToggleModel({
        userid: user._id,
        postid,
      });
      record = await record.save();
      await postModel.findByIdAndUpdate(postid, {
        $push: { likes: record._id },
      });
      successResponse(res, 201, { message: "post is liked" });
    }
  } catch (error) {
    errorResponse(res, error.statusCode, { message: error.message });
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
    const user = req.user;
    const { postid, title, content } = req.body;
    await postValidator.addCommentPostsAccess(req, res);
    let comment = new commentModel({
      postid,
      userid: user._id,
      title,
      content,
    });
    comment = await comment.save();
    await postModel.findByIdAndUpdate(postid, {
      $push: { comments: comment._id },
    });

    successResponse(res, 201, { message: "comment submitted successfully" });
  } catch (error) {
    errorResponse(res, error.statusCode, { message: error.message });
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
    user = req.user;
    const mySavesRecord = await savepostsModel.find({ userid: user.id });
    let myPosts = [];
    for (const item of mySavesRecord) {
      const result = await postModel.findOne({ _id: item.postid });
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
      .populate("comments")
      .populate("likes", "-__v");

    if (result == null) {
      throwError("post is not found", 404);
    }
    successResponse(res, 200, { result });
  } catch (error) {
    errorResponse(res, error.statusCode, { message: error.message });
  }
};
