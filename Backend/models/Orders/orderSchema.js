const mongoose = require("mongoose");
const User = require("../User");
const Customer = require("../customer_schema.js");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    custDetails: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    orderDate: {
      type: Date,
      default: Date(Date.now()),
    },
    description: {
      type: String,
    },
    deliveryDate: {
      type: Date,
      default: Date(Date.now()),
    },
    orderDetails: [
      {
        productName: String,
        quantity: Number,
        pricePerUnit: Number,
        amount: Number,
      },
    ],
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "On-Hold", "Sent"],
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    totalQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
