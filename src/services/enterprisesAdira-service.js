const EnterprisesUser = require("../models/enterprisesAdiraUser");
const EnterprisesAdiraUserPlan = require("../models/enterprisesAdiraUserPlan");

async function getUserByPhoneNumber(phoneNumber) {
  try {
    const user = EnterprisesUser.findOne({ mobileNumber: phoneNumber });
    return user;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get user by phone number");
  }
}

async function getUserById(Id) {
  try {
    const user = await EnterprisesUser.findById(id);
    return user;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get user by ID");
  }
}

async function updateUserAdiraPlan(
  userId,
  planId,
  startDate,
  endDate,
  paymentId,
  paidAmount
) {
  try {
    const NewUserPlan = await EnterprisesAdiraUserPlan.create({
      user: userId,
      plan: planId,
      startDate,
      endDate,
      paymentId,
      paidAmount,
    });
    return NewUserPlan;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update user's adira plan");
  }
}

module.exports = { getUserByPhoneNumber, updateUserAdiraPlan, getUserById };
