const fs = require("fs");
const storyModel = require("../../../models/v1/story");
const mediaStoryModel  = require("../../../models/v1/mediaStory");


exports.createStory = async (req, res) => {
  try {
    const user = req.user;

    // Handle case where no file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "An image is required for the story" });
    }

    // Create a new media document
    const mediaStory = new mediaStoryModel({
      path: `images/story/${req.file.filename}`,
      filename: req.file.filename,
    });

    await mediaStory.save();

    // Find the story for the user
    let story = await storyModel.findOne({ "user.id": user._id });

    if (story) {
      // If story exists, add new media to the media array
      story.media.push(mediaStory._id);
    } else {
      // If no story exists, create a new story
      story = new storyModel({
        media: [mediaStory._id],
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
    }

    await story.save();
    res.status(201).json({ message: "Story created successfully", story });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.getStories = async (req, res) => {
  try {
    // Fetch stories from the database
    const stories = await storyModel.find().populate('media'); // Populate media references

    // Return stories (even if the array is empty)
    res.status(200).json({ stories: stories || [] });
  } catch (error) {
    // Handle any errors that occur
    res.status(500).json({ message: error.message });
  }
};



exports.deleteMedia = async (req , res) => {
  const { storyId, mediaId } = req.body;
  try {
      // حذف مدیا از پایگاه داده
      await mediaStoryModel.findByIdAndDelete(mediaId);

      // بروزرسانی استوری برای حذف مدیا از آرایه مدیاها
      const story = await storyModel.findById(storyId);
      if (!story) {
          return res.status(404).json({ message: "Story not found" });
      }

      // حذف مدیا از آرایه مدیاها
      story.media = story.media.filter(media => media.toString() !== mediaId);
      await story.save();

      // اگر هیچ مدیایی برای استوری باقی نمانده بود، استوری را هم حذف کنید
      if (story.media.length === 0) {
          await storyModel.findByIdAndDelete(storyId);
          return res.status(200).json({ message: "Media deleted and story removed" });
      }

      return res.status(200).json({ message: "Media deleted successfully", story });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
  }
}