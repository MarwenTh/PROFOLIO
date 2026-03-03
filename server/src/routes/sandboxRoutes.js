const express = require("express");
const router = express.Router();
const sandboxController = require("../controllers/sandboxController");
const authenticateToken = require("../middleware/authMiddleware");

router.use(authenticateToken);

router.get("/", sandboxController.getUserComponents);
router.get("/:id", sandboxController.getComponentById);
router.post("/save", sandboxController.saveComponent);
router.post("/:id/publish", sandboxController.publishToMarketplace);
router.delete("/:id", sandboxController.deleteComponent);

module.exports = router;
