const express = require("express");
const MailingListRoutes = require("./mailingList-routes");
const DocumentDrafter = require("./documentDrafter-routes");
const Razorpay = require("./razorpay-routes");
const AiDrafter = require("./aiDrafter-routes");
const router = express.Router();

router.use("/mailinglist", MailingListRoutes);
router.use("/documentDrafter", DocumentDrafter);
router.use("/payment", Razorpay);
router.use("/ai-drafter", AiDrafter);

module.exports = router;
