const mongoose = require("mongoose");
const storyModel = require("./story"); 

const schema = new mongoose.Schema(
    {
        path: { type: String, required: true },
        filename: { type: String, required: true },
        createdAt: { type: Date, default: Date.now}, 
    },
    { _id: true } 
);

const model = mongoose.model("mediaStory", schema);
module.exports = model;
