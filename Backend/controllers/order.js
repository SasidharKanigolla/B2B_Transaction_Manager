const Order = require("../models/Orders/orderSchema");
const Customer = require("../models/customer_schema");

module.exports.getOrders = async (req, res) => {
  try {
    const order = await Order.find().populate("custDetails");
    res.json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports.newOrder = async (req, res) => {
  try {
    // Validate input
    const { owner, name } = req.body;
    if (!owner || !name) {
      return res
        .status(400)
        .json({ message: "Owner and name are required fields." });
    }
    if (
      !req.body.status ||
      !["Active", "On-Hold", "Sent"].includes(req.body.status)
    ) {
      req.body.status = "Active";
    }
    const custDet = await Customer.findOne({ owner, name });
    if (!custDet) {
      return res.status(404).json({ message: "Customer not found." });
    }
    const newOrder = new Order({ ...req.body, custDetails: custDet });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

module.exports.changeStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log(req.params);
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the order status" });
  }
};

module.exports.removeOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(deletedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the order" });
  }
};
