const mongoose = require("mongoose");
const initdata = require("./trans_data.js");
const Transaction = require("../models/transaction_Schema.js");

main()
  .then(() => {
    console.log("connection is successful");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/allTransaction");
}

const initdb = async () => {
  await Transaction.deleteMany();
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    custDetails: "65e47188e8bb3ca6f6b6c8d0",
    transType: "Debit",
    totalAmount: 10,
  }));
  await Transaction.insertMany(initdata.data);

  console.log("Data added to the database successfully!");
};
initdb();
