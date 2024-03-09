const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const watchesListSchema = new Schema({
  list_of_symbol: [
    {
      userId: String,
      symbol: String,
      stock_order: {
        orderId: Number,
        orderType: String,
        tradeType: String,
        symbol: String,
        quantity: Number,
        price: String,
        timestamp: String,
      },

      position: {
        orderId: Number,
        orderType: String,
        tradeType: String,
        symbol: String,
        quantity: Number,
        price: String,
        pNlReport: Number,
        investedAmount: Number,
        timestamp: String,
      },

      performance: {
        orderId: Number,
        orderType: String,
        tradeType: String,
        symbol: String,
        quantity: Number,
        price: String,
        pNlReport: Number,
        investedAmount: Number,
        timestamp: String,
        exitPrice: String,
      },
    },
  ],
});


const WatchList = mongoose.model("WatchList", watchesListSchema);

module.exports = { WatchList };
