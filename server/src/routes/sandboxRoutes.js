const express = require("express");
const router = express.Router();
const {
  listUserSandboxes,
  getSandbox,
  createSandbox,
  updateSandbox,
  deleteSandbox,
  publishSandbox,
  trackView,
  trackCopy,
} = require("../controllers/sandboxController");

/** List all sandboxes for a user — GET /api/sandbox?userId=123 */
router.get("/", listUserSandboxes);

/** Create a new sandbox — POST /api/sandbox */
router.post("/", createSandbox);

/** Get a single sandbox — GET /api/sandbox/:id */
router.get("/:id", getSandbox);

/** Update sandbox (autosave) — PUT /api/sandbox/:id */
router.put("/:id", updateSandbox);

/** Delete a sandbox — DELETE /api/sandbox/:id */
router.delete("/:id", deleteSandbox);

/** Publish / submit for review — POST /api/sandbox/:id/publish */
router.post("/:id/publish", publishSandbox);

/** Track a view — POST /api/sandbox/:id/view */
router.post("/:id/view", trackView);

/** Track a code copy — POST /api/sandbox/:id/copy */
router.post("/:id/copy", trackCopy);

module.exports = router;
