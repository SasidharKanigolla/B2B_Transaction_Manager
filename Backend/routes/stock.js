const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync");
const stockController = require("../controllers/stock");

router.get("/getStocks", wrapAsync(stockController.getAllStocks));
// router.get("/stockTransactions",wrapAsync(stockController.))
router.post("/addStock", wrapAsync(stockController.addNewStock));

router.get("/getStockData/:id", wrapAsync(stockController.getStockData));

router.post(
  "/newSupplierStockTrans",
  wrapAsync(stockController.newPurchaseItem)
);

router.get(
  "/deleteSupplierStockTransaction/:id",
  wrapAsync(stockController.deleteSupplierStockTransaction)
);

router.post("/newCustomerStockTrans", wrapAsync(stockController.newSaleItem));

router.get(
  "/deleteCustomerStockTransaction/:id",
  wrapAsync(stockController.deleteCustomerStockTransaction)
);

router.get("/deleteStock/:id", wrapAsync(stockController.deleteStock));
module.exports = router;
