const fs = require("fs");
const Message = require("../../../models/v1/message");



exports.getAllMessage = async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: -1 }); // همه پیام‌ها را از پایگاه داده می‌گیرد
        res.status(200).json(messages); // پیام‌ها را در پاسخ برمی‌گرداند
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve messages" }); // در صورت خطا، پاسخ خطا برمی‌گردد
    }
}

exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.body;

        // حذف پیام از پایگاه داده
        const deletedMessage = await Message.findByIdAndDelete(messageId);

        if (!deletedMessage) {
            return res.status(404).json({ error: "Message not found" });
        }

        return res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete message" });
    }
}


