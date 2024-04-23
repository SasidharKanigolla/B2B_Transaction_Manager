const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync");
const orderController = require("../controllers/order");

router.get("/getOrders", wrapAsync(orderController.getOrders));

router.post("/NewOrder", wrapAsync(orderController.newOrder));

router.put("/status/:id", wrapAsync(orderController.changeStatus));

router.delete("/delete/:id", wrapAsync(orderController.removeOrder));

module.exports = router;
