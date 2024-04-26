const mongoose = require("mongoose");
const User = require("./User");
const Schema = mongoose.Schema;
const { string } = require("joi");

const custSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      // required: true,
      unique: true,
    },
    gst: {
      type: String,
    },
    address: {
      type: String,
    },
    // {/* Supplier copied */}

    bankName: {
      type: String,
    },
    bankAccountNumber: {
      type: Number,
    },
    bankIfsc: {
      type: String,
    },

    // {/* Supplier copied */}

    amount: {
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

// custSchema.plugin(passpotLocalMongoose);

const Customer = mongoose.model("Customer", custSchema);

module.exports = Customer;
