const mongoose = require("mongoose");
const {
  paymentStatus,
  billingCycles,
  AdiraBillingCycles,
} = require("../utils/common/constants");

const EnterprisesAdiraPlanOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "EnterprisesUser",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: [
        paymentStatus.INITIATED,
        paymentStatus.SUCCESS,
        paymentStatus.FAILED,
      ],
      required: true,
    },
    planName: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
    },
    billingCycle: {
      type: String,
      enum: [
        AdiraBillingCycles.MONTHLY,
        AdiraBillingCycles.DAILY,
        AdiraBillingCycles.WEEKLY,
      ],
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const EnterprisesAdiraPlanOrder = new mongoose.model(
  "EnterprisesAdiraPlanOrder",
  EnterprisesAdiraPlanOrderSchema
);

module.exports = EnterprisesAdiraPlanOrder;
