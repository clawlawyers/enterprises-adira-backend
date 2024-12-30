const mongoose = require("mongoose");

const talkToExpertSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.ObjectId,
    ref: "EnterprisesUser",
    required: true,
  },
  doc_id: {
    type: String,
  },
  User_name: {
    type: String,
  },
  email_id: {
    type: String,
  },
  contact_no: {
    type: String,
  },
  meeting_date: {
    type: String,
  },
  start_time: {
    type: String,
  },
  end_time: {
    type: String,
  },
  user_query: {
    type: String,
  },
  additional_details: {
    type: String,
  },
  number_of_pages: {
    type: Number,
  },
  customer_type: {
    type: String,
    enum: [
      "only vetting of document generated by Adira",
      "consulting",
      "consulting and vetting of document generated by Adira",
      "only vetting of document generated by Adira",
      "consulting and vetting of document generated by Adira",
    ],
  },
  meeting_link: {
    type: String,
  },
});

const TalkToExpert = mongoose.model("TalkToExpert", talkToExpertSchema);

module.exports = TalkToExpert;
