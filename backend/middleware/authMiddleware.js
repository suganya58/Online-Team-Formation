const mongoose = require("mongoose");
const User = require("../models/User");

/**
 * Middleware to enforce Administrator access only (role === "admin")
 */
async function requireAdmin(req, res, next) {
  try {
    const userId =
      req.headers["x-user-id"] ||
      req.headers["x-admin-id"] ||
      req.body.userId ||
      req.query.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(403).json({
        message: "Forbidden: Administrator credentials required.",
      });
    }

    const user = await User.findById(userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden: Administrator access required.",
      });
    }

    req.adminUser = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { requireAdmin };
