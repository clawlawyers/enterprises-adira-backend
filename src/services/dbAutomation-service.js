const EnterprisesAdiraUserPlan = require("../models/enterprisesAdiraUserPlan");

async function deleteExpiredPlans() {
  try {
    // Get the current date
    const currentDate = new Date();

    // Find and delete the user plans where the endDate is earlier than the current date
    const result = await EnterprisesAdiraUserPlan.deleteMany({
      endDate: { $lt: currentDate }, // $lt means 'less than', so it checks if endDate is in the past
    });

    if (result.deletedCount > 0) {
      console.log(`${result.deletedCount} expired plans deleted.`);
    } else {
      console.log("No expired plans found.");
    }
  } catch (error) {
    console.error("Error deleting expired plans:", error);
  }
}

module.exports = {
  deleteExpiredPlans,
};
