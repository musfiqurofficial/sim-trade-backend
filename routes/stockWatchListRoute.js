const express = require("express");
const router = express.Router();
const { WatchList } = require("../models/StockWatchList");
const dotenv = require("dotenv");
const { authenticateToken } = require("../middleware/authMiddleware");

dotenv.config();

router.post("/addStockToWatchList", async (req, res) => {
  try {
    const { userId, symbol } = req.body;

    let watchlist = await WatchList.findOne({
      "list_of_symbol.userId": userId,
    });

    if (!watchlist) {
      watchlist = new WatchList({
        list_of_symbol: [{ userId, symbol }],
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
      watchlist.list_of_symbol.push({ userId, symbol });
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

router.post("/addStockToOrderList", async (req, res) => {
  try {
    const { userId, symbol, stock_order, position, performance } = req.body;

    let watchlist = await WatchList.findOne({
      "list_of_symbol.userId": userId,
    });

    if (!watchlist) {
      return res
        .status(400)
        .json({ message: `User ${userId} does not have a watchlist.` });
    }

    const symbolExists = watchlist.list_of_symbol.some(
      (item) => item.symbol === symbol
    );

    if (!symbolExists) {
      return res
        .status(400)
        .json({ message: `Stock ${symbol} is not in the watchlist.` });
    }

    const stockIndex = watchlist.list_of_symbol.findIndex(
      (item) => item.symbol === symbol
    );

    watchlist.list_of_symbol[stockIndex].stock_order = stock_order;
    watchlist.list_of_symbol[stockIndex].position = position;
    watchlist.list_of_symbol[stockIndex].performance = performance;

    await watchlist.save();
    res
      .status(200)
      .json({ message: `Stock ${symbol} updated in order list successfully.` });
  } catch (error) {
    console.error("Error updating stock in order list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/getWatchListSymbols/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const watchlist = await WatchList.findOne({
      "list_of_symbol.userId": userId,
    });

    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found for user." });
    }

    const symbols = watchlist.list_of_symbol.map((item) => item.symbol);

    res.status(200).json({ symbols });
  } catch (error) {
    console.error("Error getting watchlist symbols:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/getStockOrderList/:userId", async (req, res) => {
  try {
    const userID = req.params.userId;

    const watchlist = await WatchList.findOne({
      "list_of_symbol.userId": userID,
    });

    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found for user." });
    }

    const stockOrderList = watchlist.list_of_symbol.map((item) => {
      return {
        symbol: item.symbol,
        stock_order: item.stock_order || null,
        position: item.position || null,
        performance: item.performance || null,
      };
    });

    res.status(200).json({ stockOrderList });
  } catch (error) {
    console.error("Error getting stock order list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/removeStockFromWatchList/:userId/:symbol", async (req, res) => {
  try {
    const { userId, symbol } = req.params;

    let watchlist = await WatchList.findOne({
      "list_of_symbol.userId": userId,
    });

    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found for user." });
    }

    const indexToRemove = watchlist.list_of_symbol.findIndex(
      (item) => item.symbol === symbol
    );

    if (indexToRemove === -1) {
      return res.status(404).json({ message: "Symbol not found in the watchlist." });
    }

    if (watchlist.list_of_symbol[indexToRemove].stock_order?.orderId) {
      return res.status(400).json({ message: "Cannot delete item with orderId." });
    }

    watchlist.list_of_symbol.splice(indexToRemove, 1);
    await watchlist.save();

    res.status(200).json({ message: `Symbol ${symbol} removed from watchlist.` });
  } catch (error) {
    console.error("Error removing stock from watchlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
