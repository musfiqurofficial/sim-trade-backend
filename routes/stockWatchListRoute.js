const express = require("express");
const router = express.Router();
const { WatchList } = require("../models/StockWatchList");
const dotenv = require("dotenv");
const { authenticateToken } = require("../middleware/authMiddleware");

dotenv.config();

router.post("/addStockToWatchList",  async (req, res) => {
  try {
    const { userId, symbol } = req.body;

    let watchlist = await WatchList.findOne({
      "list_of_symbol.userId": userId,
    });

    if (!watchlist) {
      watchlist = new WatchList({
        list_of_symbol: [
          { userId, symbol, stock_order: [], position: [], performance: [] },
        ],
      });
    } else {
      const symbolExists = watchlist.list_of_symbol.some(
        (item) => item.symbol === symbol
      );    
      if (symbolExists) {
        return res
          .status(400)
          .json({ message: `Stock ${symbol} is already in the watchlist.` });
      }
      watchlist.list_of_symbol.push({
        userId,
        symbol,
        stock_order: [],
        position: [],
        performance: [],
      });
    }
    await watchlist.save();

    res
      .status(200)
      .json({ message: `Stock ${symbol} added to watchlist successfully.` });
  } catch (error) {
    console.error("Error adding stock to watchlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
