// server/routes/salesman.js
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middlewares");
const RazorpayController = require("../../controllers/razorpay-controller");
const { checkClientAuth } = require("../../middlewares/auth-middleware");

router.post("/create-order", RazorpayController.createPayment);
router.post("/verifyPayment", RazorpayController.verifyPayment);

router.post(
  "/talk-to-expert-createOrder",
  RazorpayController.talkToExpertCreateOrder
);
router.post(
  "/talk-to-expert-verifyOrder",
  RazorpayController.talkToExpertVerifyOrder
);

router.post("/create-subscription", RazorpayController.createSubscription);
router.post("/verify-subscription", RazorpayController.verifySubscription);

router.post(
  "/createPaymentLink",
  checkClientAuth,
  RazorpayController.createPaymentLink
);

router.post("/razorpay-webhook", RazorpayController.rezorpayWebhook);

module.exports = router;
