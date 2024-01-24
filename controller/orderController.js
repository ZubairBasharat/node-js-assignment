const orderModel = require('../models/order');
const tickerBookModel = require("../models/tickerBook")
const helper = require("../helper")
module.exports = {
    placeOrder: async (req, res) => {
        try {
            var data = req.body;
            let orderInstance = await orderModel.create(data);

            let tickerBookInstance = await tickerBookModel.addOrderInBook(orderInstance);
            let result;
            if (orderInstance.orderSide === 'buy' && tickerBookInstance.sellSideOrders.length > 0) {
                result = await tickerBookModel.executeOrder(orderInstance, tickerBookInstance, 'sell');
            } else if (orderInstance.orderSide === 'sell' && tickerBookInstance.buySideOrders.length > 0) {
                result = await tickerBookModel.executeOrder(orderInstance, tickerBookInstance, 'buy');
            }


            return res.json(helper.showSuccessResponse("ORDER_PLACE_SUCCESS", orderInstance))
        } catch (error) {
            console.log(error);
            return res.json(
                helper.showInternalServerErrorResponse('INTERNAL_SERVER_ERROR')
            );
        }
    },
    findSellRestingOrdersByTicker: async (req, res) => {
        try {
            let orders = await orderModel.find({ stockTicker: req.params.ticker, orderSide: "sell" });

            return res.json(helper.showSuccessResponse("GET_ORDERS_SUCCESS", orders))
        } catch (error) {
            console.log(error);
            return res.json(
                helper.showInternalServerErrorResponse('INTERNAL_SERVER_ERROR')
            );
        }
    },
    findBuyRestingOrdersByTicker: async (req, res) => {
        try {
            let orders = await orderModel.find({ stockTicker: req.params.ticker, orderSide: "buy" });

            return res.json(helper.showSuccessResponse("GET_ORDERS_SUCCESS", orders))
        } catch (error) {
            console.log(error);
            return res.json(
                helper.showInternalServerErrorResponse('INTERNAL_SERVER_ERROR')
            );
        }
    },
    getExecutedOrdersByTicker: async (req, res) => {
        try {
            // Assuming you have a model for tickerBook
            const tickerBook = await tickerBookModel.findOne({ tickerTitle: req.params.ticker });

            if (!tickerBook) {
                return res.json(helper.showNotFoundResponse('Ticker book not found'));
            }

            const executedOrders = tickerBook.executedOrders || [];


            return res.json(helper.showSuccessResponse("GET_ORDERS_SUCCESS", executedOrders))
        } catch (error) {
            console.log(error);
            return res.json(
                helper.showInternalServerErrorResponse('INTERNAL_SERVER_ERROR')
            );
        }
    },
    getBuyRestingSharesByTicker: async (req, res) => {
        try {
            // Assuming you have a model for tickerBook
            const tickerBook = await tickerBookModel.findOne({ tickerTitle: req.params.ticker });

            if (!tickerBook) {
                return res.json(helper.showNotFoundResponse('Ticker book not found'));
            }

            const buyRestingSharesQuantity = tickerBook.buyRestingSharesQuantity || 0;


            return res.json(helper.showSuccessResponse("GET_SHARES_SUCCESS", buyRestingSharesQuantity))
        } catch (error) {
            console.log(error);
            return res.json(
                helper.showInternalServerErrorResponse('INTERNAL_SERVER_ERROR')
            );
        }
    },
    getSellRestingSharesByTicker: async (req, res) => {
        try {
            // Assuming you have a model for tickerBook
            const tickerBook = await tickerBookModel.findOne({ tickerTitle: req.params.ticker });

            if (!tickerBook) {
                return res.json(helper.showNotFoundResponse('Ticker book not found'));
            }

            const sellRestingSharesQuantity = tickerBook.sellRestingSharesQuantity;


            return res.json(helper.showSuccessResponse("GET_SHARES_SUCCESS", sellRestingSharesQuantity))
        } catch (error) {
            console.log(error);
            return res.json(
                helper.showInternalServerErrorResponse('INTERNAL_SERVER_ERROR')
            );
        }
    }
}
