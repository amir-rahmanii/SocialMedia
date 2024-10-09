const express = require("express");
const controller = require("./story.controller");
const auth = require("../../../middlewares/v1/auth");
const { multerStorage } = require("../../../middlewares/uploaderConfigs");
const upload = multerStorage(
  "public/images/story",
  /png|jpeg|jpg|webp|mp4|mkv/
);
const router = express.Router();


// * POST
router
  .route("/createStory")
  .post(auth, upload.single("storyMedia"), controller.createStory);

router.route("/deleteStory").delete(auth, controller.deleteMedia);

// * GET
router.route("/get-all-stories").get(auth, controller.getStories);
// router.route("/get-story/:storyId").get(auth, controller.getStoryById);

module.exports = router;