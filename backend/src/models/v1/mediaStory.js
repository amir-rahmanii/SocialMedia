const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        path: { type: String, required: true },
        filename: { type: String, required: true },
        createdAt: { type: Date, default: Date.now, expires: '24h' }, // اضافه کردن createdAt با TTL index برای حذف خودکار
    },
    { _id: true } 
);

const model = mongoose.model("mediaStory", schema);
module.exports = model;
