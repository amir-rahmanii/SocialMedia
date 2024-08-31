const express = require("express");
const controller = require("./message.controller");
const auth = require("../../../middlewares/v1/auth");
const router = express.Router();







router.route("/get-all-message").get(auth, controller.getMessages);

module.exports = router;