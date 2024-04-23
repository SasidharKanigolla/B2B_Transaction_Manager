const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const Supplier = require("./SupplierSchema");
const Customer = require("../customer_schema");
const User = require("../User");

const supplierTransactionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date(Date.now()),
    },
    bill_no: {
      type: String,
      required: true,
    },
    transType: {
      type: String,
      required: true,
    },
    supplierDetails: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    purchaseDetails: [
      {
        productName: String,
        quantity: Number,
        pricePerUnit: Number,
        amount: Number,
      },
    ],
    totalPurchaseAmount: {
      type: Number,
    },
    totalPurchaseQuantity: {
      type: Number,
    },
    paidAmount: [
      {
        transactionType: String,
        discount: Number,
        amount: Number,
        transactionId: String,
      },
    ],
    totalPaidAmount: {
      type: Number,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Supplier_transaction = new mongoose.model(
  "Supplier_transaction",
  supplierTransactionSchema
);

module.exports = Supplier_transaction;
