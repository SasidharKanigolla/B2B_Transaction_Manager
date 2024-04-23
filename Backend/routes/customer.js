const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync");
const customerController = require("../controllers/customer");

router.get("/", wrapAsync(customerController.getCustomers));

router.post("/newCustomer", wrapAsync(customerController.newCustomer));

router.post("/newTransaction", wrapAsync(customerController.newTransaction));

router.get("/viewcustomer/:id", wrapAsync(customerController.viewCustomer));

router.get(
  "/viewtransaction/:id",
  wrapAsync(customerController.viewTransaction)
);

router.delete(
  "/deletecustomer/:id",
  wrapAsync(customerController.deleteCustomer)
);

router.delete(
  "/deletetransaction/:id",
  wrapAsync(customerController.deleteTransaction)
);

router.put("/editcustomer/:id", wrapAsync(customerController.editCustomer));

router.put(
  "/edittransaction/:id",
  wrapAsync(customerController.editTransaction)
);

module.exports = router;
