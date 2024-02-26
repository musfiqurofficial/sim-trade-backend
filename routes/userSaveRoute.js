const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const User = require("../models/User");
const { authenticateToken } = require("../middleware/authMiddleware");

dotenv.config();

router.get("/user-save", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      userId: user.userId,
      username: user.username,
      email: user.email,
      balance: user.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
