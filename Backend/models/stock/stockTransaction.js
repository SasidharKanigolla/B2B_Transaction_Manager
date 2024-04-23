const mongoose = require("mongoose");
const User = require("../User");
const Stock = require("./stockSchema");
const SupplyTransaction = require("../supplier/SupplyTransaction");
const transaction_Schema = require("../transaction_Schema");
const Schema = mongoose.Schema;

const stockTransactionSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date(Date.now()),
  },
  quantity: {
    type: Number,
  },
  pricePerUnit: {
    type: Number,
  },
  amount: {
    type: Number,
  },
  prod_details: {
    type: Schema.Types.ObjectId,
    ref: "Stock",
  },
  transaction_type: {
    type: String,
  },
  // transaction_details: {
  //   type: Schema.Types.ObjectId,
  //   ref: "SupplyTransaction",
  // },
  transaction_details: {
    type: Schema.Types.ObjectId,
    refPath: "transactionModel",
  },
  transactionModel: {
    type: String,
    enum: ["SupplyTransaction", "transaction_Schema"],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const StockTransaction = mongoose.model(
  "StockTransaction",
  stockTransactionSchema
);

module.exports = StockTransaction;
