const express = require("express");
const controller = require("./post.controller");
const auth = require("../../../middlewares/v1/auth");
const { multerStorage } = require("../../../middlewares/uploaderConfigs");
const upload = multerStorage(
  "public/images/posts",
  /png|jpeg|jpg|webp|mp4|mkv/
);
const router = express.Router();
// POST ------------->

router
  .route("/create-post")
  .post(auth, upload.array("media", 5), controller.createPost); // The number `5` limits the number of files.

router.route("/like-toggle").post(auth, controller.likeToggle);
router.route("/save-post-toggle").post(auth, controller.savePostToggle);
router.route("/add-comment").post(auth, controller.addComment);

// PUT ------------------->

router
  .route("/update-post")
  .put(auth, upload.array("media", 5), controller.updatePost);

// DELETE -------------------->

router.route("/delete-post").delete(auth, controller.deletePost);
router.route("/delete-comment").delete(auth, controller.deleteComment);

// GET-------------->

router.route("/get-all-posts").get(auth, controller.getAllPosts);
router.route("/my-posts").get(auth, controller.myPosts);
router.route("/search-posts").get(auth, controller.searchPosts);
router.route("/post-details").get(auth, controller.postDetails);
router.route("/my-save-posts").get(auth, controller.mySavePosts);

module.exports = router;
