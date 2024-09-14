const express = require("express");
const controller = require("./ticket.controller");
const auth = require("../../../middlewares/v1/auth");
const checkAdminRole = require("../../../middlewares/v1/checkAdminRole");
const router = express.Router();



router.route("/add-new-ticket").post(auth, controller.addNewTicket);
router.route("/user-tickets").get(auth, controller.getUserTicket);

router.route("/respond-ticket/:ticketId").put(auth , checkAdminRole, controller.respondTicket);



module.exports = router;