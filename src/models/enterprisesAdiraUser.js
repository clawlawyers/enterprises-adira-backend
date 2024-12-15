const mongoose = require("mongoose");

const EnterperiseuserSchema = new mongoose.Schema(
  {
    // name: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    lastUsedDate: {
      type: Date, // To track when the token was last used
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const EnterprisesUser = mongoose.model(
  "EnterprisesUser",
  EnterperiseuserSchema
);

module.exports = EnterprisesUser;
