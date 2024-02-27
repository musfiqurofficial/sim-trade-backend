const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stockOrderSchema = new Schema({
  orderId: Number,
  orderType: String,
  tradeType: String,
  symbol: String,
  quantity: Number,
  price: Number,
  userId: String,
  timestamp: Number,
});

const positionSchema = new Schema({
  orderId: Number,
  orderType: String,
  tradeType: String,
  symbol: String,
  quantity: Number,
  price: Number,
  userId: String,
  pNlReport: Number,
  investedAmount: Number,
  timestamp: Number,
});

const performanceSchema = new Schema({
  orderId: Number,
  orderType: String,
  tradeType: String,
  symbol: String,
  quantity: Number,
  price: Number,
  userId: String,
  pNlReport: Number,
  investedAmount: Number,
  timestamp: Number,
  exitPrice: Number,
});

const watchesListSchema = new Schema({
  list_of_symbol: [
    {
      userId: String,
      symbol: String,
      stock_order: [stockOrderSchema],
      position: [positionSchema],
      performance: [performanceSchema],
    },
  ],
});

const WatchList = mongoose.model("WatchList", watchesListSchema);

module.exports = { WatchList };
