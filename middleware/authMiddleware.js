const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();  

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  // console.log("Received token:", token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. Token not provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = { authenticateToken };
