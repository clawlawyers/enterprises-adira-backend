const EnterprisesAdiraPlanOrder = require("../models/enterpriseAdiraPlanOrder");

async function createOrder(order) {
  try {
    const newOrder = await EnterprisesAdiraPlanOrder.create(order);
    return newOrder;
  } catch (error) {
    console.log(error);
    throw new Error("Error while creating order");
  }
}

async function updateOrder(orderId, updateOrder) {
  try {
    const updatedOrder = await EnterprisesAdiraPlanOrder.findByIdAndUpdate(
      orderId,
      updateOrder
    );
    return updatedOrder;
  } catch (error) {
    console.log(error);
    throw new Error("Error while updating order");
  }
}

module.exports = { createOrder, updateOrder };
