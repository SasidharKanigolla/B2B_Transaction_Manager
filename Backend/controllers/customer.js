const Customer = require("../models/customer_schema");
const Transaction = require("../models/transaction_Schema");

// app.get("/customer",
module.exports.getCustomers = async (req, res) => {
  const customerDetails = await Customer.find();
  const transactionDetails = await Transaction.find().populate("custDetails");
  res.json([customerDetails, transactionDetails]);
};

// app.post("/customer/newCustomer",
module.exports.newCustomer = async (req, res) => {
  let {
    name,
    mobile,
    gst,
    address,
    owner,
    bankName,
    bankAccountNumber,
    bankIfsc,
  } = req.body;
  const newCustomer = new Customer({
    name: name.substring(0, 40).toUpperCase(),
    mobile: mobile,
    gst: gst,
    address: address,
    bankName: bankName,
    bankAccountNumber: bankAccountNumber,
    bankIfsc: bankIfsc,
    owner: owner,
  });
  let newData = await newCustomer.save();
  res.json(newData);
};

// app.post("/customer/newTransaction",
module.exports.newTransaction = async (req, res) => {
  let {
    name,
    transType,
    date,
    invoice,
    credit,
    description,
    custDetails,
    transDetails,
    totalDebitAmount,
    totalCreditAmount,
    totalAmount,
    totalQuantity,
    owner,
  } = req.body;
  custDetails = await Customer.findOne({ name: name, owner: owner });
  console.log(custDetails);
  totalAmount = totalDebitAmount - totalCreditAmount;
  const updatedCustomer = await Customer.findByIdAndUpdate(
    custDetails._id,
    { amount: custDetails.amount + totalAmount },
    { new: true }
  );
  const newTrans = new Transaction({
    name: name,
    transType: transType,
    date: new Date(date),
    invoice: invoice,
    description: description,
    custDetails: custDetails._id,
    credit: credit,
    transDetails: transDetails,
    totalDebitAmount: totalDebitAmount,
    totalCreditAmount: totalCreditAmount,
    totalQuantity: totalQuantity,
    totalAmount: totalAmount,
    owner: owner,
  });
  let newData = await newTrans.save();
  res.json(newData);
};

// app.get("/customer/viewcustomer/:id",
module.exports.viewCustomer = async (req, res) => {
  const { id } = req.params;
  const customer = await Customer.findById(id);
  const transactions = await Transaction.find({ custDetails: id });
  res.json([customer, transactions]);
};

// app.get("/customer/viewtransaction/:id",
module.exports.viewTransaction = async (req, res) => {
  const { id } = req.params;
  const transactions = await Transaction.findById(id).populate("custDetails");
  res.json(transactions);
};

// app.delete("/customer/deletetransaction/:id",
module.exports.deleteTransaction = async (req, res) => {
  let { id } = req.params;
  const transaction = await Transaction.findById(id).populate("custDetails");
  const updatedCustomer = await Customer.findByIdAndUpdate(
    transaction.custDetails._id,
    { amount: transaction.custDetails.amount - transaction.totalAmount },
    { new: true }
  );
  const deletedDate = await Transaction.deleteOne({ _id: id });
  res.json(deletedDate);
};

// app.delete("/customer/deletecustomer/:id",
module.exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;
  const result = await Transaction.deleteMany({ custDetails: id });
  const deleteCustomer = await Customer.findByIdAndDelete(id);
  res.json(deleteCustomer);
};

// app.put("/customer/editcustomer/:id",
module.exports.editCustomer = async (req, res) => {
  try {
    let { id } = req.params;
    let { name, mobile, gst, address, bankName, bankAccountNumber, bankIfsc } =
      req.body;
    const customer = await Customer.findByIdAndUpdate(
      id,
      {
        name: name.substring(0, 40).toUpperCase(),
        // name:name.substring(0,40),
        mobile,
        gst,
        address,
        bankName,
        bankAccountNumber,
        bankIfsc,
      },
      { new: true }
    );
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// app.put("/customer/edittransaction/:id",
module.exports.editTransaction = async (req, res) => {
  const { id } = req.params;
  let {
    name,
    transType,
    date,
    invoice,
    credit,
    description,
    custDetails,
    transDetails,
    totalDebitAmount,
    totalCreditAmount,
    totalAmount,
    totalQuantity,
  } = req.body;
  totalAmount = totalDebitAmount - totalCreditAmount;
  const transaction = await Transaction.findById(id);
  const updatedAmount = totalAmount - transaction.totalAmount;
  const updatedCustomer = await Customer.findByIdAndUpdate(
    custDetails._id,
    { amount: custDetails.amount + updatedAmount },
    { new: true }
  );
  const updatedTransaction = await Transaction.findByIdAndUpdate(
    id,
    {
      name,
      transType,
      date,
      invoice,
      description,
      credit,
      transDetails,
      custDetails,
      totalDebitAmount,
      totalCreditAmount,
      totalAmount,
      totalQuantity,
    },
    { new: true }
  );
  res.json(updatedTransaction);
};
