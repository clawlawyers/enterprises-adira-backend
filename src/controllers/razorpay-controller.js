const { RAZORPAY_ID, RAZORPAY_SECRET_KEY } = require("../config/server-config");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const {
  OrderService,
  ClientService,
  AdiraOrderService,
  EnterprisesAdiraService,
  EnterprisesAdiraOrderService,
} = require("../services");
const { ErrorResponse, SuccessResponse } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");
const { paymentStatus } = require("../utils/common/constants");
const { GptServices } = require("../services");
const { AL_DRAFTER_API } = process.env;
const axios = require("axios");
const TalkToExpert = require("../models/talkToExpert");

const razorpay = new Razorpay({
  key_id: RAZORPAY_ID,
  key_secret: RAZORPAY_SECRET_KEY,
});

// planNamesquence = ["BASIC_M", "ESSENTIAL_M", "BASIC_Y", "ESSENTIAL_Y"];

const isLive = true;

const LiveplanNamesquence = isLive
  ? [
      { name: "BASIC_M", price: 399, id: "plan_OvrQPqMurmW9P2" },
      { name: "BASIC_Y", price: 3999, id: "plan_OvrS1uLssYZZ5A" },
      { name: "ESSENTIAL_M", price: 1199, id: "plan_OvrQvRwtnJhEpo" },
      { name: "ESSENTIAL_Y", price: 11999, id: "plan_OvrSVyFS74Lgbr" },
      { name: "PREMIUM_M", price: 1999, id: "plan_OvrRWAtQRSoKHu" },
      { name: "PREMIUM_Y", price: 19999, id: "plan_OvrSvJaxOqEuxG" },
      { name: "ADDON_M", price: 899, id: "plan_OvrTcADlxAi3Fq" },
    ]
  : [
      { name: "BASIC_M", price: 399, id: "plan_OvslHBSlbwE1lM" },
      { name: "BASIC_Y", price: 3999, id: "plan_OvsmK9WNPatC33" },
      { name: "ESSENTIAL_M", price: 1199, id: "plan_OvsmWrzM694xvr" },
      { name: "ESSENTIAL_Y", price: 11999, id: "plan_OvsmpBeBxh8SS5" },
      { name: "PREMIUM_M", price: 1999, id: "plan_Ovsn4BAGrxqz7V" },
      { name: "PREMIUM_Y", price: 19999, id: "plan_OvsnLSAarhWgJg" },
      { name: "ADDON_M", price: 899, id: "plan_OvsnZFctyVRhn5" },
    ];

const LiveOfferplanNamesquence = isLive
  ? [
      { name: "BASIC_M", price: 199, id: "plan_OydA5Ekx6q2Cvf" },
      { name: "BASIC_Y", price: 1999, id: "plan_OydYkw0YXrKu4N" },
      { name: "ESSENTIAL_M", price: 699, id: "plan_OydAxwpAvxG0L0" },
      { name: "ESSENTIAL_Y", price: 6999, id: "plan_OydhV1HSz1IwWc" },
      { name: "PREMIUM_M", price: 1199, id: "plan_OydT8PYPUZzwNJ" },
      { name: "PREMIUM_Y", price: 11999, id: "plan_OyditM9Is1AREu" },
    ]
  : [
      { name: "BASIC_M", price: 199, id: "plan_OxqVBZBd8zgPzl" },
      { name: "BASIC_Y", price: 1999, id: "plan_OxqVfzDcqf1qey" },
      { name: "ESSENTIAL_M", price: 699, id: "plan_OxqWsZ3onTMiHw" },
      { name: "ESSENTIAL_Y", price: 6999, id: "plan_OxqXInXr75GmLt" },
      { name: "PREMIUM_M", price: 1199, id: "plan_OxqXiIPa0szExN" },
      { name: "PREMIUM_Y", price: 11999, id: "plan_OydlmF2HCHk2cI" },
    ];

const planNamesquence = [
  { name: "BASIC_M", price: 399, id: "plan_OvslHBSlbwE1lM" },
  { name: "BASIC_Y", price: 3999, id: "plan_OvsmK9WNPatC33" },
  { name: "ESSENTIAL_M", price: 1199, id: "plan_OvsmWrzM694xvr" },
  { name: "ESSENTIAL_Y", price: 11999, id: "plan_OvsmpBeBxh8SS5" },
  { name: "PREMIUM_M", price: 1999, id: "plan_Ovsn4BAGrxqz7V" },
  { name: "PREMIUM_Y", price: 19999, id: "plan_OvsnLSAarhWgJg" },
  { name: "ADDON_M", price: 899, id: "plan_OvsnZFctyVRhn5" },
];

const OfferplanNamesquence = [
  { name: "BASIC_M", price: 199, id: "plan_OxqVBZBd8zgPzl" },
  { name: "BASIC_Y", price: 1999, id: "plan_OxqVfzDcqf1qey" },
  { name: "ESSENTIAL_M", price: 699, id: "plan_OxqWsZ3onTMiHw" },
  { name: "ESSENTIAL_Y", price: 6999, id: "plan_OxqXInXr75GmLt" },
  { name: "PREMIUM_M", price: 1199, id: "plan_OxqXiIPa0szExN" },
  { name: "PREMIUM_Y", price: 11999, id: "plan_OydlmF2HCHk2cI" },
];

async function talkToExpertCreateOrder(req, res) {
  const { amount, currency, receipt } = req.body;
  try {
    const options = {
      amount: amount * 100,
      currency,
      receipt,
    };

    const orderr = await razorpay.orders.create(options);
    const combinedResponse = {
      razorpayOrder: orderr,
    };
    console.log(combinedResponse);
    res.status(200).json(combinedResponse);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function fetchTelegramBot({
  doc_id,
  User_name,
  email_id,
  contact_no,
  meeting_date,
  start_time,
  end_time,
  user_query,
  additional_details,
  number_of_pages,
  customer_type,
}) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    console.log({
      doc_id,
      User_name,
      email_id,
      contact_no,
      meeting_date,
      start_time,
      end_time,
      user_query,
      additional_details,
      number_of_pages,
      customer_type,
    });
    const response = await axios.post(
      `${AL_DRAFTER_API}/api/telegram_bot`,
      // method: "POST",
      {
        doc_id,
        User_name,
        email_id,
        contact_no,
        meeting_date,
        start_time,
        end_time,
        user_query,
        additional_details,
        number_of_pages,
        customer_type,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    if (!response.ok) {
      // const errorText = await response.text(); // Get the error message from the response
      // throw new Error(`message: ${errorText}`);
    }
    // const responseData = await response.json();
    // return responseData;
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function talkToExpertVerifyOrder(req, res) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    meetingData,
    phoneNumber,
  } = req.body;
  try {
    const hmac = crypto.createHmac("sha256", RAZORPAY_SECRET_KEY);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature === razorpay_signature) {
      const {
        doc_id,
        User_name,
        email_id,
        contact_no,
        meeting_date,
        start_time,
        end_time,
        user_query,
        additional_details,
        number_of_pages,
        customer_type,
      } = meetingData;
      const fetchUser = await EnterprisesAdiraService.getUserByPhoneNumber(
        phoneNumber
      );

      fetchedMeeting = await fetchTelegramBot({
        doc_id,
        User_name,
        email_id,
        contact_no,
        meeting_date,
        start_time,
        end_time,
        user_query,
        additional_details,
        number_of_pages,
        customer_type,
      });
      console.log(fetchedMeeting);
      const generatedMeeting = await TalkToExpert.create({
        client: fetchUser._id,
        doc_id,
        User_name,
        email_id,
        contact_no,
        meeting_date,
        start_time,
        end_time,
        user_query,
        additional_details,
        number_of_pages,
        customer_type,
        meeting_link: fetchedMeeting,
      });
      res
        .status(StatusCodes.OK)
        .json(SuccessResponse({ fetchedMeeting, generatedMeeting }));
    } else {
      res.status(400).json({ status: "Payment verification failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

async function createPayment(req, res) {
  const { amount, currency, receipt, planName, billingCycle, phoneNumber } =
    req.body;
  // const { _id, phoneNumber } = req.body.client;
  console.log(req.body);

  const fetchUser = await EnterprisesAdiraService.getUserByPhoneNumber(
    phoneNumber
  );

  console.log(fetchUser._id.toHexString());

  const order = await EnterprisesAdiraOrderService.createOrder({
    price: amount,
    planName,
    billingCycle,
    user: fetchUser._id,
    paymentStatus: paymentStatus.INITIATED,
  });

  try {
    const options = {
      amount: amount * 100,
      currency,
      receipt,
    };

    const orderr = await razorpay.orders.create(options);
    const combinedResponse = {
      razorpayOrder: orderr,
      createdOrder: order,
    };
    console.log(combinedResponse);
    res.status(200).json(combinedResponse);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function verifyPayment(req, res) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    _id,
    planId,
    createdAt,
    expiresAt,
    amount,
  } = req.body;

  const hmac = crypto.createHmac("sha256", RAZORPAY_SECRET_KEY);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generated_signature = hmac.digest("hex");
  let rs;

  if (generated_signature === razorpay_signature) {
    try {
      const placedOrder = await EnterprisesAdiraOrderService.updateOrder(_id, {
        paymentStatus: paymentStatus.SUCCESS,
      });

      // update the plan for user
      console.log(placedOrder.user.toString(), placedOrder.planName);

      rs = await EnterprisesAdiraService.updateUserAdiraPlan(
        placedOrder.user.toString(),
        planId,
        createdAt,
        expiresAt,
        razorpay_order_id,
        amount
      );
      // insert it into user purchase

      // await GptServices.insertIntoUserPurchase(
      //   placedOrder.user.toString(),
      //   placedOrder.plan,
      //   createdAt,
      //   razorpay_order_id,
      //   expiresAt,
      //   refferalCode,
      //   amount,
      //   couponCode
      // );

      console.log(rs);
    } catch (error) {
      console.log(error);
    }
    res.status(200).json({ status: "Payment verified successfully", plan: rs });
  } else {
    res.status(400).json({ status: "Payment verification failed" });
  }
}

const WebHookCode = "Clawapp.dev";

async function rezorpayWebhook(req, res) {
  const receivedSignature = req.headers["x-razorpay-signature"];
  const payload = JSON.stringify(req.body);

  // Validate the webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", WebHookCode)
    .update(payload)
    .digest("hex");

  if (receivedSignature === expectedSignature) {
    const event = req.body.event;

    // Handle payment success event
    if (event === "payment_link.paid") {
      const paymentDetails = req.body.payload.payment_link.entity;
      const paymentId = paymentDetails.id;
      const customerMobile = paymentDetails.customer.contact;
      const userId = paymentDetails.notes.userId;
      const planName = paymentDetails.notes.planName;
      const price = paymentDetails.notes.price;
      const amountPaid = paymentDetails.amount_paid;

      const payment_link = await GptServices.updateUserPlanPayment(
        userId,
        planName,
        paymentId,
        price
      );

      await GptServices.UpdatetoUserPurchase(
        userId,
        planName,
        paymentId,
        price,
        payment_link
      );

      // Update the database with payment details
      // mockDatabase[customerMobile] = {
      //     paymentId,
      //     amountPaid,
      //     status: 'Paid',
      // };

      const obj = {
        customerMobile,
        userId,
        paymentId,
        amountPaid,
        status: "Paid",
      };

      // Option 1: Using JSON.stringify
      console.log(
        `Payment successful for mobile: ${JSON.stringify(obj, null, 2)}`
      );

      // Option 2: Logging the object separately
      console.log("Payment successful for mobile:", obj);
      // Respond with success
      res.status(200).json({ success: true });
    } else {
      res.status(200).json({ success: true, message: "Event not handled" });
    }
  } else {
    console.log("Invalid signature, possible tampering detected");
    res.status(403).json({ success: false, message: "Invalid signature" });
  }
}

module.exports = {
  createPayment,
  verifyPayment,
  rezorpayWebhook,
  talkToExpertVerifyOrder,
  talkToExpertCreateOrder,
};
