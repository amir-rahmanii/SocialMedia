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
      path: `images/stories/${req.file.filename}`,
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


// exports.getStoryById = async (req , res) => {
//   try {
//     const { storyId } = req.params;

//     // پیدا کردن استوری بر اساس ID
//     const story = await storyModel.findById(storyId).populate('user.id', 'username email name userPicture');

//     if (!story) {
//       return res.status(404).json({ message: "Story not found" });
//     }

//     res.status(200).json({ story });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }

// }