const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");

router.get("/secure-data", authenticateToken, (req, res) => {
  res.json({ message: "This data is secure!" });
});

module.exports = router;
