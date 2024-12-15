const mongoose = require("mongoose");

const enterprisesAdiraPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  totalTokens: { type: Number, required: true },
  duration: { type: Number, required: true }, // in days
});

const EnterprisesAdiraPlan = mongoose.model(
  "EnterprisesAdiraPlan",
  enterprisesAdiraPlanSchema
);

module.exports = EnterprisesAdiraPlan;
