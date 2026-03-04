const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  syncUser,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/sync", syncUser);

// Protected Routes
router.get("/me", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
