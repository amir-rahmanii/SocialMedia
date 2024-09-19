const express = require("express");
const controller = require("./ticket.controller");
const auth = require("../../../middlewares/v1/auth");
const router = express.Router();



router.route("/add-new-ticket").post(auth, controller.addNewTicket);
router.route("/user-tickets").get(auth, controller.getUserTicket);

router.route("/respond-ticket").put(auth , controller.respondTicket);
router.route('/add-rating').put(auth, controller.updateRating);



module.exports = router;