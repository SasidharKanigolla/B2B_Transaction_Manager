const Stock = require("../models/stock/stockSchema");
const StockTransaction = require("../models/stock/stockTransaction");

module.exports.getAllStocks = async (req, res) => {
  const stockData = await Stock.find();
  res.json(stockData);
};

module.exports.addNewStock = async (req, res) => {
  let { name_of_prod, owner } = req.body;
  // console.log(req.body);
  const newStock = new Stock({
    name_of_prod: name_of_prod.trim().toUpperCase(),

    total_quan: 0,
    // total_price: 0,
    owner: owner,
  });
  try {
    const result = await newStock.save();
    // console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error occurred while saving new stock:", error);
    res.status(500).json({ error: "Failed to save new stock" });
  }
};

module.exports.getStockData = async (req, res) => {
  let { id } = req.params;
  const stockData = await Stock.findById(id);
  const transactionData = await StockTransaction.find({ prod_details: id });
  res.json([stockData, transactionData]);
};

module.exports.newPurchaseItem = async (req, res) => {
  try {
    let {
      productName,
      name_of_prod,
      quantity,
      date,
      pricePerUnit,
      amount,
      transaction_type,
      transaction_details,
      owner,
    } = req.body;

    if (!productName && !name_of_prod) {
      return res.status(400).json({ error: "Product name is required" });
    }

    const existingStock = await Stock.findOne({
      name_of_prod: productName?.toUpperCase() || name_of_prod?.toUpperCase(),
      owner: owner,
    });

    let updatedStock;
    if (!existingStock) {
      const newStock = new Stock({
        name_of_prod: productName?.toUpperCase() || name_of_prod?.toUpperCase(),
        total_quan: quantity,
        // total_price: amount,
        owner: owner,
      });
      const savedStock = await newStock.save();
      updatedStock = savedStock;
    } else {
      updatedStock = await Stock.findOneAndUpdate(
        { _id: existingStock._id },
        {
          $inc: {
            total_quan: quantity,
            // total_price: amount
          },
        },
        { new: true }
      );
    }

    const newStockTrans = new StockTransaction({
      productName: productName || name_of_prod,
      quantity: quantity,
      pricePerUnit: pricePerUnit,
      amount: amount,
      date: date,
      transaction_type: transaction_type,
      transaction_details: transaction_details,
      prod_details: updatedStock._id,
      owner: owner,
    });

    const result = await newStockTrans.save();
    // console.log(result);
    res.json(result);
  } catch (error) {
    console.error("Error occurred while processing new purchase item:", error);
    res.status(500).json({ error: "Failed to process new purchase item" });
  }
};

module.exports.deleteSupplierStockTransaction = async (req, res) => {
  let { id } = req.params;
  const stockTrans = await StockTransaction.find({
    transaction_details: id,
  });
  for (let i = 0; i < stockTrans.length; i++) {
    const stockTransaction = stockTrans[i];

    // Find the associated stock
    const stock = await Stock.findById(stockTransaction.prod_details);
    // console.log(stock);
    // Update the stock quantities and amounts
    const updatedStock = await Stock.findByIdAndUpdate(
      stockTransaction.prod_details,
      {
        total_quan: stock.total_quan - stockTransaction.quantity,
        // total_price: stock.total_price - stockTransaction.amount,
      },
      { new: true }
    );

    // Delete the stock transaction
    const result = await StockTransaction.findByIdAndDelete(
      stockTransaction._id
    );
  }
  res.status(200).json("Data deleted succesfully");
};

module.exports.newSaleItem = async (req, res) => {
  let {
    productName,
    quantity,
    date,
    pricePerUnit,
    amount,
    transaction_type,
    transaction_details,
    owner,
  } = req.body;

  // Find the stock item
  const stock = await Stock.findOne({
    name_of_prod: productName?.toUpperCase(),
    owner: owner,
  });
  // console.log(stock);
  // Update the stock item
  const updatedStock = await Stock.findOneAndUpdate(
    { _id: stock._id },
    {
      $inc: {
        total_quan: -quantity,
        // total_price: -amount
      },
    },
    { new: true }
  );

  // Create a new stock transaction
  const newStockTrans = new StockTransaction({
    productName: productName,
    quantity: quantity,
    pricePerUnit: pricePerUnit,
    amount: amount,
    date: date,
    transaction_type: transaction_type,
    transaction_details: transaction_details,
    prod_details: updatedStock._id,
    owner: owner,
  });

  // Save the new stock transaction
  const result = await newStockTrans.save();
  // console.log(result);

  // Send the result as JSON response
  res.json(result);
};

module.exports.deleteCustomerStockTransaction = async (req, res) => {
  let { id } = req.params;
  const stockTrans = await StockTransaction.find({
    transaction_details: id,
  });
  for (let i = 0; i < stockTrans.length; i++) {
    const stockTransaction = stockTrans[i];

    // Find the associated stock
    const stock = await Stock.findById(stockTransaction.prod_details);
    // console.log(stock);
    // Update the stock quantities and amounts
    const updatedStock = await Stock.findByIdAndUpdate(
      stockTransaction.prod_details,
      {
        total_quan: stock.total_quan + stockTransaction.quantity,
        // total_price: stock.total_price + stockTransaction.amount,
      },
      { new: true }
    );

    // Delete the stock transaction
    const result = await StockTransaction.findByIdAndDelete(
      stockTransaction._id
    );
  }
  res.status(200).json("Data deleted succesfully");
};
module.exports.deleteStock = async (req, res) => {
  let { id } = req.params;
  // console.log(id);
  const stockTransaction = await StockTransaction.deleteMany({
    prod_details: id,
  });
  const stockDeleted = await Stock.findByIdAndDelete(id);

  res.json(stockDeleted);
};
