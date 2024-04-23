const mongoose = require("mongoose");
const initdata = require("./cust_data.js");
const Customer = require("../models/customer_schema.js");

main()
  .then(() => {
    console.log("connection is successful");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/allTransaction");
}

const initdb = async () => {
  await Customer.insertMany(initdata.data);

  console.log("Data added to the database successfully!");
};
initdb();
