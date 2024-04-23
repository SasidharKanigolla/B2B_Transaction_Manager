const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    buss_name: {
      type: String,
      required: true,
    },
    mob: {
      type: Number,
      required: true,
    },
    deleteTrans: {
      type: String,
      required: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
