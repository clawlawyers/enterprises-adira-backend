const mongoose = require("mongoose");

const enterprisesAdiraUserPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EnterprisesUser",
    required: true,
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EnterprisesAdiraPlan",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  totalTokenUsed: {
    type: Number,
    required: true,
    default: 0,
  },
  paymentId: {
    type: String,
    required: true,
    default: "",
    unique: true,
  },
  paidAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  lastUsedDate: {
    type: Date, // To track when the token was last used
    default: null,
  },
});

const EnterprisesAdiraUserPlan = mongoose.model(
  "EnterprisesAdiraUserPlan",
  enterprisesAdiraUserPlanSchema
);

module.exports = EnterprisesAdiraUserPlan;
