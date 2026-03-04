const express = require("express");
const router = express.Router();
const {
  getUserPortfolios,
  createPortfolio,
  getPortfolioById,
  getPortfolioBySlug,
  updatePortfolio,
} = require("../controllers/portfolioController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getUserPortfolios);
router.post("/create", authMiddleware, createPortfolio);
router.get("/:id", authMiddleware, getPortfolioById);
router.get("/slug/:slug", getPortfolioBySlug); // Public route
router.put("/:id", authMiddleware, updatePortfolio);

module.exports = router;
