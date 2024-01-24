var mongoose = require("mongoose");
var orderSchema = mongoose.Schema(
  {
    userName: { type: String, default: null },
    orderSide: {
      type: String,
      enum: ["sell", "buy"],
      default: null,
    },
    stockTicker: {
      type: String,
      enum: ["Google", "Facebook", "Oracle", "Oxit"],
      default: null,
    },
    stockPrice: { type: Number, default: 0 },
    currencySign: { type: String, default: "$" },
    orderSharesQuantity: { type: Number, default: 0 },
    orderStatus: {
      type: String,
      enum: ["placed", "partially-executed"],
      default: "placed",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const orderTable = (module.exports = mongoose.model("order", orderSchema));
