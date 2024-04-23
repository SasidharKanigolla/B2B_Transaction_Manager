// const Supplier = require("../models/supplier/SupplierSchema");
const Supplier = require("../models/customer_schema.js");
const Supplier_transaction = require("../models/supplier/SupplyTransaction.js");
const StockTransaction = require("../models/stock/stockTransaction.js");
const Stock = require("../models/stock/stockSchema.js");

// // app.post("/supplier/newSupplier",
// module.exports.newSupplier = async (req, res) => {
//   let {
//     name,
//     mobile,
//     address,
//     brokerDetails,
//     bankName,
//     // transType
//     bankAccountNumber,
//     bankIfsc,
//     owner,
//   } = req.body;
//   const newSupplier = new Supplier({
//     name: name.substring(0, 40).toUpperCase(),
//     mobile: mobile,
//     address: address,
//     brokerDetails: brokerDetails,
//     bankName: bankName,
//     bankAccountNumber: bankAccountNumber,
//     bankIfsc: bankIfsc,
//     owner: owner,
//   });
//   const savedSupplier = await newSupplier.save();
//   res.json(savedSupplier);
// };

// app.get("/supplier/getSuppliers",
module.exports.getSuppliers = async (req, res) => {
  const suppliers = await Supplier.find();
  res.json(suppliers);
};

// app.get("/supplier/viewsupplier/:id",
module.exports.viewSupplier = async (req, res) => {
  const { id } = req.params;
  const supplierData = await Supplier.findById(id);
  const transactiondata = await Supplier_transaction.find({
    supplierDetails: id,
  });
  res.json([supplierData, transactiondata]);
};

// app.delete("/supplier/deletesupplier/:id",
// module.exports.deleteSupplier = async (req, res) => {
//   let { id } = req.params;
//   const deletedTrans = await Supplier_transaction.deleteMany({
//     supplierDetails: id,
//   });
//   const deletedSupplier = await Supplier.findByIdAndDelete(id);
//   res.json(deletedSupplier);
// };

// app.put("/supplier/editSupplier/:id",
// module.exports.editSupplier = async (req, res) => {
//   const { id } = req.params;
//   let {
//     name,
//     mobile,
//     address,
//     brokerDetails,
//     bankName,
//     // transType
//     bankAccountNumber,
//     bankIfsc,
//     owner,
//   } = req.body;
//   const updatedSupplier = await Supplier.findByIdAndUpdate(
//     id,
//     {
//       name: name.substring(0, 40).toUpperCase(),
//       mobile: mobile,
//       address: address,
//       brokerDetails: brokerDetails,
//       bankName: bankName,
//       bankAccountNumber: bankAccountNumber,
//       bankIfsc: bankIfsc,
//       owner: owner,
//     },
//     {
//       new: true,
//     }
//   );
//   res.json(updatedSupplier);
// };

// app.post("/supplier/newsupptrans",
module.exports.newSupplTrans = async (req, res) => {
  try {
    let {
      name,
      date,
      bill_no,
      transType,
      purchaseDetails,
      totalPurchaseAmount,
      totalPurchaseQuantity,
      paidAmount,
      totalPaidAmount,
      owner,
    } = req.body;
    const supplierDetails = await Supplier.findOne({
      name: name,
      owner: owner,
    });
    // console.log(supplierDetails);
    const totalAmount = totalPurchaseAmount - totalPaidAmount;
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      supplierDetails._id,
      { amount: supplierDetails.amount - totalAmount },
      { new: true }
    );
    const newSupplier = new Supplier_transaction({
      name: name,
      date: new Date(date),
      bill_no: bill_no,
      transType: transType,
      purchaseDetails: purchaseDetails,
      totalPurchaseAmount: totalPurchaseAmount,
      totalPurchaseQuantity: totalPurchaseQuantity,
      paidAmount: paidAmount,
      supplierDetails: supplierDetails._id,
      totalPaidAmount: totalPaidAmount,
      owner: owner,
    });
    const result = await newSupplier.save();
    res.json(result);
  } catch (error) {
    // Handle any errors that occur during the process
    // console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// app.get("/supplier/supplierTransactions",
module.exports.getSupplierTransactions = async (req, res, next) => {
  try {
    const suppliersTran = await Supplier_transaction.find().populate(
      "supplierDetails"
    );
    res.json(suppliersTran);
  } catch (error) {
    next(error);
  }
};

// app.get("/supplier/viewsuppliertransaction/:id",
module.exports.viewSupplierTransaction = async (req, res) => {
  const { id } = req.params;
  const transactions = await Supplier_transaction.findById(id).populate(
    "supplierDetails"
  );
  if (!transactions) {
    return res.status(404).json({ error: "Transaction not found" });
  }
  res.json(transactions);
};

// app.put("/supplier/editsuppltrans/:id"
module.exports.editTransaction = async (req, res) => {
  const { id } = req.params;
  let {
    name,
    date,
    bill_no,
    transType,
    purchaseDetails,
    totalPurchaseAmount,
    totalPurchaseQuantity,
    paidAmount,
    totalPaidAmount,
  } = req.body;
  const totalAmount = totalPurchaseAmount - totalPaidAmount;
  const transaction = await Supplier_transaction.findById(id).populate(
    "supplierDetails"
  );
  const updatedAmmount =
    totalAmount -
    (transaction.totalPurchaseAmount - transaction.totalPaidAmount);
  // console.log(updatedAmmount);
  const updatedSupplier = await Supplier.findByIdAndUpdate(
    transaction?.supplierDetails?._id, // Customer ID
    { amount: transaction?.supplierDetails?.amount - updatedAmmount }, // New value for totalAmount
    { new: true } // Return the updated document
  );
  // console.log(updatedSupplier);
  // const stockTrans = await StockTransaction.find({ transaction_details: id });

  const updatedTransaction = await Supplier_transaction.findByIdAndUpdate(
    id,
    {
      name,
      date,
      bill_no,
      transType,
      purchaseDetails,
      totalPurchaseAmount,
      totalPurchaseQuantity,
      paidAmount,
      totalPaidAmount,
    },
    { new: true }
  );
  res.status(200).json(updatedTransaction);
};

// app.delete("/supplier/deleteSupplierTransaction/:id",
module.exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await Supplier_transaction.findById(id).populate(
      "supplierDetails"
    );

    const totalAmount =
      transaction?.totalPurchaseAmount - transaction?.totalPaidAmount;
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      transaction?.supplierDetails?._id,
      { amount: transaction?.supplierDetails?.amount + totalAmount },
      { new: true }
    );
    const deletedTrans = await Supplier_transaction.findByIdAndDelete(id);
    res.json(deletedTrans);
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.json({ error: "Internal server error" });
  }
};
