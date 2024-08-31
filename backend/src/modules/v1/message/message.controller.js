const fs = require("fs");
const messageModel = require("../../../models/v1/message");
const userModel = require("../../../models/v1/user");






// message.controller.js
exports.getMessages = async (req, res) => {
    const { fromUserId, toUserId } = req.query;

    // Check if toUserId is empty
    if (!toUserId) {
        return res.json([]);
    }

    try {
        // Check if toUserId exists in the database
        const toUser = await userModel.findById(toUserId);
        if (!toUser) {
            return res.json([]);
        }

        const messages = await messageModel.find({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
            .populate('fromUserId', 'username profilePicture')
            .populate('toUserId', 'username profilePicture')
            .sort({ createdAt: 'asc' });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving messages' });
    }
};

