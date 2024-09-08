const mongoose = require("mongoose");
const storyModel = require("./story"); // مدل استوری را ایمپورت کنید


const schema = new mongoose.Schema(
    {
        path: { type: String, required: true },
        filename: { type: String, required: true },
        createdAt: { type: Date, default: Date.now, expires: '24h' }, // اضافه کردن createdAt با TTL index برای حذف خودکار
    },
    { _id: true } 
);


schema.post('remove', async function(doc) {
    try {
        // شناسه mediaStory حذف شده
        const mediaId = doc._id;

        // همه استوری‌هایی که این media را دارند پیدا کنید و آن را حذف کنید
        await storyModel.updateMany(
            { media: mediaId }, // جستجو برای استوری‌هایی که این media را دارند
            { $pull: { media: mediaId } } // حذف این media از آرایه
        );

        console.log(`Media with ID ${mediaId} removed from related stories.`);
    } catch (error) {
        console.error("Error removing media from stories:", error);
    }
});


const model = mongoose.model("mediaStory", schema);
module.exports = model;
