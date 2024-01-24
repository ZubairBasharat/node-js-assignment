var mongoose = require("mongoose");
const Order = require("./order")
var tickerBookSchema = mongoose.Schema(
    {
        tickerTitle: { type: String, default: null },
        buyRestingSharesQuantity: { type: Number, default: 0 },
        sellRestingSharesQuantity: { type: Number, default: 0 },
        buySideOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'order' }],
        sellSideOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'order' }],
        executedOrders: [{
            orderDetails: { type: mongoose.Schema.Types.ObjectId, ref: "order" },
            stockTicker: { type: String, default: null },
            orderSide: { type: String, default: null },
            Price: { type: Number, default: null },
            Shares: { type: Number, default: null },
        }],
        buyRestingSharesQuantity: { type: Number, default: 0 },
        sellRestingSharesQuantity: { type: Number, default: 0 }
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

const tickerBookTable = (module.exports = mongoose.model("tickerBook", tickerBookSchema));

module.exports.addOrderInBook = async function (orderInstance) {
    let tickerBookInstance = await tickerBookTable.findOne({ tickerTitle: orderInstance.stockTicker });

    if (!tickerBookInstance) {
        tickerBookInstance = await tickerBookTable.create({ tickerTitle: orderInstance.stockTicker });
    }

    // Add the orderInstance to the ticker book based on the orderInstance side
    if (orderInstance.orderSide === 'buy') {
        tickerBookInstance.buySideOrders.push(orderInstance._id);
        tickerBookInstance.buyRestingSharesQuantity += orderInstance.orderSharesQuantity;
    } else if (orderInstance.orderSide === 'sell') {
        tickerBookInstance.sellSideOrders.push(orderInstance._id);
        tickerBookInstance.sellRestingSharesQuantity += orderInstance.orderSharesQuantity;
    }

    // Save the changes to the ticker book
    await tickerBookInstance.save();
    return tickerBookInstance;
}
module.exports.executeOrder = async function (orderInstance, tickerBookInstance, oppositeSide) {
    try {
        const oppositeSideOrders = tickerBookInstance[oppositeSide + 'SideOrders'];
        const oppositeSideRestingSharesQuantity = tickerBookInstance[oppositeSide + 'RestingSharesQuantity'];

        let remainingShares = orderInstance.orderSharesQuantity;
        console.log("oppositeSideOrders===>>>>>>>>>", oppositeSideOrders.length)
        console.log("orderInstance===>>>>>>>>>", orderInstance)
        for (let i = 0; i < oppositeSideOrders.length; i++) {
            console.log("oppositeSideOrders[i]===>>>>>>>>>", oppositeSideOrders[i])
            const restingOrder = await Order.findById(oppositeSideOrders[i]);
            console.log("restingOrder===>>>>>>>>>", restingOrder)
            if (orderInstance.orderSide === 'buy' && restingOrder.stockPrice <= orderInstance.stockPrice) {
                // Execute the order
                const executionShares = Math.min(restingOrder.orderSharesQuantity, remainingShares);
                remainingShares -= executionShares;

                // Log the execution
                // You can adjust this according to your executed order model
                console.log(`Order executed: Ticker ${orderInstance.stockTicker}, Price ${restingOrder.stockPrice}, Shares ${executionShares}`);
                restingOrder.orderStatus = "partially-executed";
                // Update the resting order and remove it if fully executed
                restingOrder.orderSharesQuantity -= executionShares;

                if (restingOrder.orderSharesQuantity === 0) {

                    await Order.deleteOne({ _id: restingOrder._id });
                } else {
                    await restingOrder.save();
                }

                // Update the ticker book's resting shares quantity
                tickerBookInstance[oppositeSide + 'RestingSharesQuantity'] -= executionShares;

                // Push the executed order details to the executedOrders array
                tickerBookInstance.executedOrders.push({
                    orderDetails: restingOrder._id,
                    stockTicker: restingOrder.stockTicker,
                    orderSide: restingOrder.orderSide,
                    Price: restingOrder.stockPrice,
                    Shares: executionShares,
                });

                if (remainingShares === 0) {
                    break; // The incoming order is fully executed
                }
            } else if (orderInstance.orderSide === 'sell' && restingOrder.stockPrice >= orderInstance.stockPrice) {
                // Execute the order
                const executionShares = Math.min(restingOrder.orderSharesQuantity, remainingShares);
                remainingShares -= executionShares;

                // Log the execution
                // You can adjust this according to your executed order model
                console.log(`Order executed: Ticker ${orderInstance.stockTicker}, Price ${restingOrder.stockPrice}, Shares ${executionShares}`);
                restingOrder.orderStatus = "partially-executed";
                // Update the resting order and remove it if fully executed
                restingOrder.orderSharesQuantity -= executionShares;

                if (restingOrder.orderSharesQuantity === 0) {
                    await Order.deleteOne({ _id: restingOrder._id });
                } else {
                    await restingOrder.save();
                }

                // Update the ticker book's resting shares quantity
                tickerBookInstance[oppositeSide + 'RestingSharesQuantity'] -= executionShares;

                // Push the executed order details to the executedOrders array
                tickerBookInstance.executedOrders.push({
                    orderDetails: restingOrder._id,
                    stockTicker: restingOrder.stockTicker,
                    orderSide: restingOrder.orderSide,
                    Price: restingOrder.stockPrice,
                    Shares: executionShares,
                });

                if (remainingShares === 0) {
                    break; // The incoming order is fully executed
                }
            }
        }

        // Add any remaining shares of the incoming order to the book
        if (remainingShares > 0) {
            await Order.findOneAndUpdate({ _id: orderInstance._id }, {
                userName: orderInstance.userName,
                orderSide: orderInstance.orderSide,
                stockTicker: orderInstance.stockTicker,
                stockPrice: orderInstance.stockPrice,
                currencySign: orderInstance.currencySign,
                orderSharesQuantity: remainingShares,
                orderStatus: 'partially-executed', // You may need to adjust this based on your order status values
            });

            tickerBookInstance[orderInstance.orderSide + 'RestingSharesQuantity'] += remainingShares;

            console.log(`Remaining shares added to the book: Ticker ${orderInstance.stockTicker}, Price ${orderInstance.stockPrice}, Shares ${remainingShares}`);

        }
        await tickerBookInstance.save();
        return tickerBookInstance; // Return the updated tickerBookInstance
    } catch (error) {
        throw error;
    }
};
