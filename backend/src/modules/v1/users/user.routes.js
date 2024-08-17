const express = require("express");
const controller = require("./user.controller");
const auth = require("../../../middlewares/v1/auth");
const router = express.Router();
// * POST
router.route("/register").post(controller.register);
router.route("/login").post(controller.login);
router.route("/update-password").post(controller.updatePassword);
router.route("/forget-password").post(controller.forgetPassword);
router.route("/user-ban-toggle").post(auth, controller.userBanToggle);
// * GET
router.route("/reset-password").get(controller.resetPassword);
router.route("/refresh-token").get(controller.refreshToken);
router.route("/user-information").get(auth, controller.userInformation);

module.exports = router;
