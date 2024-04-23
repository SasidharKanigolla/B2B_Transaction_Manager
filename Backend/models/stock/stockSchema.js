const mongoose = require("mongoose");
const User = require("../User");
const Schema = mongoose.Schema;

const StockSchema = new Schema(
  {
    name_of_prod: {
      type: String,
      required: true,
    },

    opening_quan: {
      type: Number,
    },
    price_per_unit: {
      type: Number,
    },
    amount: {
      type: Number,
    },
    total_quan: {
      type: Number,
    },
    // total_price: {
    //   type: Number,
    // },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Stock = mongoose.model("Stock", StockSchema);

module.exports = Stock;
