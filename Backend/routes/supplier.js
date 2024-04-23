const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync");
const supplierController = require("../controllers/supplier");

router.post("/newSupplier", wrapAsync(supplierController.newSupplier));

router.get("/getSuppliers", wrapAsync(supplierController.getSuppliers));

router.get("/viewsupplier/:id", wrapAsync(supplierController.viewSupplier));

router.delete(
  "/deletesupplier/:id",
  wrapAsync(supplierController.deleteSupplier)
);

router.put("/editSupplier/:id", wrapAsync(supplierController.editSupplier));

router.post("/newsupptrans", wrapAsync(supplierController.newSupplTrans));

router.get(
  "/supplierTransactions",
  wrapAsync(supplierController.getSupplierTransactions)
);

router.get(
  "/viewsuppliertransaction/:id",
  wrapAsync(supplierController.viewSupplierTransaction)
);

router.put(
  "/editsuppltrans/:id",
  wrapAsync(supplierController.editTransaction)
);

router.delete(
  "/deleteSupplierTransaction/:id",
  wrapAsync(supplierController.deleteTransaction)
);

module.exports = router;
