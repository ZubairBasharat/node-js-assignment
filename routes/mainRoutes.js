module.exports = function (app) {
  var order = require("./order/order");
  app.use("/order", order);
};
