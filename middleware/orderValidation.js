const helper = require("../helper")
exports.orderValidate = (req, res, next) => {
    var data = req.body;
    if (!data.userName || !data.orderSide || !data.stockTicker || !data.stockPrice || !data.orderSharesQuantity || !data.orderSharesQuantity) {
        return res.json(helper.showValidationErrorResponse('REQUIRED_DATA_MISSING'));
    }
    if (
        data.stockTicker !== 'Google' &&
        data.stockTicker !== 'Facebook' &&
        data.stockTicker !== 'Oracle' &&
        data.stockTicker !== 'Oxit'
    ) {
        return res.json(
            helper.showValidationErrorResponse('INVALID_TICKER_TYPE')
        );
    }
    if (
        data.orderSide !== 'buy' &&
        data.orderSide !== 'sell'
    ) {
        return res.json(
            helper.showValidationErrorResponse('INVALID_ORDER_SIDE')
        );
    }
    next();
}