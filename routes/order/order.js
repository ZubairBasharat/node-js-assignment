const express = require("express");
const router = express.Router();
const orderController = require("../../controller/orderController");
const validateOrder = require("../../middleware/orderValidation")

router.post("/place-order", validateOrder.orderValidate, orderController.placeOrder)
router.get("/getExecutedOrders/:ticker", orderController.getExecutedOrdersByTicker)
router.get("/getBuyRestingShares/:ticker", orderController.getBuyRestingSharesByTicker)
router.get("/getSellRestingShares/:ticker", orderController.getSellRestingSharesByTicker)
router.get("/getSellRestingOrders/:ticker", orderController.findSellRestingOrdersByTicker)
router.get("/getBuyRestingOrders/:ticker", orderController.findBuyRestingOrdersByTicker)

module.exports = router;
