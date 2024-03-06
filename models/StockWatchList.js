const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const watchesListSchema = new Schema({
  list_of_symbol: [
    {
      userId: String,
      symbol: String,
      stock_order: [
        {
          orderId: Number,
          orderType: String,
          tradeType: String,
          symbol: String,
          quantity: Number,
          price: Number,
          timestamp: Number,
        },
      ],
      position: [
        {
          orderId: Number,
          orderType: String,
          tradeType: String,
          symbol: String,
          quantity: Number,
          price: Number,
          pNlReport: Number,
          investedAmount: Number,
          timestamp: Number,
        },
      ],
      performance: [
        {
          orderId: Number,
          orderType: String,
          tradeType: String,
          symbol: String,
          quantity: Number,
          price: Number,
          pNlReport: Number,
          investedAmount: Number,
          timestamp: Number,
          exitPrice: Number,
        },
      ],
    },
  ],
});

const WatchList = mongoose.model("WatchList", watchesListSchema);

module.exports = { WatchList };
