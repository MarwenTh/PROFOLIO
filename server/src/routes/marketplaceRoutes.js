const express = require("express");
const router = express.Router();
const marketplaceController = require("../controllers/marketplaceController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.get("/items", marketplaceController.getMarketplaceItems);

// Protected routes
router.get(
  "/my-creations",
  authMiddleware,
  marketplaceController.getMyCreations,
);
router.post("/items", authMiddleware, marketplaceController.createItem);
router.put("/items/:id", authMiddleware, marketplaceController.updateItem);
router.delete("/items/:id", authMiddleware, marketplaceController.deleteItem);
router.post(
  "/purchase/:id",
  authMiddleware,
  marketplaceController.purchaseItem,
);
router.get("/purchases", authMiddleware, marketplaceController.getMyPurchases);
router.post("/save/:id", authMiddleware, marketplaceController.saveItem);
router.get("/saved", authMiddleware, marketplaceController.getMySavedItems);
router.post(
  "/:id/integrate",
  authMiddleware,
  marketplaceController.integrateItem,
);

module.exports = router;
