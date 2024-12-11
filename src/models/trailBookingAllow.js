const mongoose = require("mongoose");

const trailBookingSchema = new mongoose.Schema({
  StartDate: { type: Date, required: true },
  EndDate: { type: Date, required: true },
  StartHour: { type: Number, required: true, min: 0, max: 23, default: 23 },
  EndHour: { type: Number, required: true, min: 0, max: 23, default: 23 },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  totalSlots: {
    type: Number,
    required: true,
  },
  bookedSlots: {
    type: Number,
    default: 0,
  },
});

const TrailBooking = mongoose.model("TrailBooking", trailBookingSchema);

module.exports = TrailBooking;
