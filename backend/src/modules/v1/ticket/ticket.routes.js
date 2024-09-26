const express = require("express");
const controller = require("./ticket.controller");
const auth = require("../../../middlewares/v1/auth");
const router = express.Router();
const isAdmin = require("../../../middlewares/checkAdmin");


router.route("/add-new-ticket").post(auth, controller.addNewTicket);
router.route("/user-tickets").get(auth, controller.getUserTicket);

router.route("/all-tickets").get(auth, isAdmin, controller.getAllTicket);

router.route("/respond-ticket").put(auth, controller.respondTicket);
router.route('/add-rating').put(auth, controller.updateRating);
router.route('/closed-ticket').put(auth, controller.closedTicket);



router.route('/remove-ticket').delete(auth, isAdmin, controller.deleteTicket);



module.exports = router;