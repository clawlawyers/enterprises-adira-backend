const mongoose = require("mongoose");
const CourtroomFeatures = require("./courtroomFeatures");

const SpecificLawCourtroomFeatureSchema = new mongoose.Schema({
  Domain: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  endDate: {
    type: Date,
    required: true,
  },
  features: CourtroomFeatures,
});

module.exports = mongoose.model(
  "SpecificLawCourtroomFeature",
  SpecificLawCourtroomFeatureSchema
);
