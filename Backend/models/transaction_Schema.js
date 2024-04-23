const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Customer = require("./customer_schema.js");
const User = require("./User");

const transSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    transType: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date(Date.now()),
    },
    credit: [
      {
        creditName: String,
        creditAmount: Number,
      },
    ],
    transDetails: [
      {
        productName: String,
        quantity: Number,
        pricePerUnit: Number,
        amount: Number,
      },
    ],
    custDetails: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    totalDebitAmount: {
      type: Number,
      default: 0,
    },
    totalCreditAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    totalQuantity: {
      type: Number,
      default: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transSchema);
module.exports = Transaction;
