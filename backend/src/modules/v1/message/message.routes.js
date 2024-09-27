const express = require("express");
const controller = require("./message.controller");
const auth = require("../../../middlewares/v1/auth");
const router = express.Router();
const isAdmin = require("../../../middlewares/checkAdmin");







router.route("/all-messages").get(auth, isAdmin, controller.getAllMessage);
router.route("/delete-messages").delete(auth, isAdmin, controller.deleteMessage);







module.exports = router;