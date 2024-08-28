const fs = require("fs");
const storyModel = require("../../../models/v1/story");


exports.createStory = async (req, res) => {
  try {
    const user = req.user;

    // Handle case where no file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "An image is required for the story" });
    }

    const media = {
      path: `images/stories/${req.file.filename}`,
      filename: req.file.filename,
    };

    // پیدا کردن استوری مربوط به کاربر
    let story = await storyModel.findOne({ "user.id": user._id });

    if (story) {
      // اگر استوری وجود داشت، مدیای جدید به آن اضافه شود
      story.media.push(media);
    } else {
      // اگر استوری وجود نداشت، یک استوری جدید ایجاد شود
      story = new storyModel({
        media: [media],
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
        const stories = await storyModel.find();

        // If no stories are found, return a 404 status
        if (!stories.length) {
            return res.status(404).json({ message: "No stories found" });
        }

        // Return the stories
        res.status(200).json({ stories });
    } catch (error) {
        // Handle any errors that occur
        res.status(500).json({ message: error.message });
    }
};


exports.getStoryById = async (req , res) => {
  try {
    const { storyId } = req.params;

    // پیدا کردن استوری بر اساس ID
    const story = await storyModel.findById(storyId).populate('user.id', 'username email name userPicture');

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    res.status(200).json({ story });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

}