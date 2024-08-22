const mongoose = require("mongoose");
const postModel = require("../../../models/v1/post");
const commentModel = require("../../../models/v1/comment");
const yup = require("yup");
const { throwError } = require("../../../utils/response");
const createPostValidator = yup.object({
  title: yup
    .string()
    .max(2200, "title cannot be more than 2200 chars long !!")
    .required("title is required"),
  description: yup
    .string()
    .max(2200, "description cannot be more than 2200 chars long !!")
    .required("Description is required"),
  hashtags: yup.string().required("hashtags is required "),
});
const deletePostValidator = yup.object({
  postid: yup.string().required("postId is required"),
});

const addCommentValidator = yup.object({
  postid: yup.string().required("postId is required"),
  title: yup
    .string()
    .max(2200, "title cannot be more than 2200 chars long !!")
    .required("title is required"),
  content: yup
    .string()
    .max(5000, "content cannot be more than 5000 chars long !!")
    .required("content is required"),
});
const deleteCommentValidator = yup.object({
  commentid: yup.string().required("commentid is required"),
});
exports.createPostAccess = async (req, res) => {
  const { title, description, hashtags } = req.body;
  await createPostValidator.validate(
    { title, description, hashtags },
    { abortEarly: false }
  );
  if (!req.file) {
    throwError("media is required", 400);
  }
};
exports.searchPostsAccess = (req, res) => {
  const query = req.query.query;
  if (!query) {
    throwError("please enter query in url", 400);
  }
};
exports.deletePostsAccess = async (req, res) => {
  const user = req.user;
  const { postid } = req.body;
  await deletePostValidator.validate(
    {
      postid,
    },
    { abortEarly: false }
  );
  const isValidObjectId = mongoose.Types.ObjectId.isValid(postid);

  if (!isValidObjectId) {
    throwError("post id is not valid", 400);
  }
  const post = await postModel.findOne({ _id: postid });
  if (!post) {
    throwError("post is not found", 404);
  }
  const isUserCreator = user._id.toString() == post.user.id.toString();

  // if (!isUserCreator) {
  //   throwError("user is not create this post or is not admin", 403);
  // }

  if (user.role !== "ADMIN" && !isUserCreator) {
    throwError("user is not create this post or is not admin", 403);
  }
};
exports.updatePostsAccess = async (req, res) => {
  const { title, description, hashtags, postid } = req.body;
  const user = req.user;

  if (!req.file) {
    throwError("enter media is required", 400);
  }
  await createPostValidator.validate(
    {
      title,
      description,
      hashtags,
    },
    { abortEarly: false }
  );
  await deletePostValidator.validate({ postid }, { abortEarly: false });
  const isValidObjectId = mongoose.Types.ObjectId.isValid(postid);
  if (!isValidObjectId) {
    throwError("post id is not valid", 400);
  }

  const post = await postModel.findOne({ _id: postid });
  if (!post) {
    throwError("post is not found", 404);
  }
  const userId = user._id.toString();
  const postCreatorId = post.user.toString();
  if (postCreatorId !== userId) {
    throwError("user is not create this post", 403);
  }
};
exports.likeTogglePostsAccess = async (req, res) => {
  const { postid } = req.body;

  await deletePostValidator.validate({ postid }, { abortEarly: false });
  const isValidObjectId = mongoose.Types.ObjectId.isValid(postid);
  if (!isValidObjectId) {
    throwError("postid is not valid", 400);
  }
  const post = await postModel.findOne({ _id: postid });
  if (!post) {
    throwError("post is not found", 404);
  }
};
exports.addCommentPostsAccess = async (req, res) => {
  const { postid, title, content } = req.body;
  await addCommentValidator.validate(
    { postid, title, content },
    { abortEarly: false }
  );
  const isValidObjectId = mongoose.Types.ObjectId.isValid(postid);
  if (!isValidObjectId) {
    throwError("postid is not valid", 400);
  }
  const post = await postModel.findOne({ _id: postid });
  if (!post) {
    throwError("post is not found", 404);
  }
};
exports.deleteCommentPostValidator = async (req, res) => {
  const { commentid } = req.body;
  const user = req.user;

  // Validate the comment ID
  await deleteCommentValidator.validate({ commentid }, { abortEarly: false });

  // Check if the comment ID is a valid ObjectId
  const isValidObjectId = mongoose.Types.ObjectId.isValid(commentid);
  if (!isValidObjectId) {
    throwError("commentid is not valid", 400);
  }

  // Find the comment in the database
  const comment = await commentModel.findOne({ _id: commentid });
  if (!comment) {
    throwError("comment is not found", 404);
  }

  const post = await postModel.findOne({ comments: commentid });
  if (!post) {
      throwError("post is not found", 404);
  }

  // Check if the user is the creator of the comment or if the user is an admin
  const isUserAuthorPost = user._id.toString() === post.user.id.toString();
  const isUserCreatorComment = user._id.toString() === comment.userid.toString();
  const isAdmin = user.role === "ADMIN";

  if (!isUserCreatorComment && !isAdmin && !isUserAuthorPost) {
    throwError("user is not the creator of this comment or user is not the creator of this post or is not an admin", 403);
  }

  // If the checks pass, proceed to delete the comment
  // Your deletion logic goes here
};

