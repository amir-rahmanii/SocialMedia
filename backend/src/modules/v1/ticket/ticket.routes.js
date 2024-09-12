const express = require("express");
const controller = require("./ticket.controller");
const auth = require("../../../middlewares/v1/auth");
const router = express.Router();



router.route("/add-new-ticket").post(auth, controller.addNewTicket);



module.exports = router;