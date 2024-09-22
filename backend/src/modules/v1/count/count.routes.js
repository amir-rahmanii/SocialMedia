const express = require("express");
const controller = require("./count.controller");
const auth = require("../../../middlewares/v1/auth");
const router = express.Router();









router.route("/all-model").get(auth, controller.countAllModel);
router.route("/total-os-count").get(auth, controller.totalOsCount);
router.route("/total-message-count").get(auth, controller.messgaeCountByMonth);







module.exports = router;