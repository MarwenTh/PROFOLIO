const { pool } = require("../config/db");

/** Default files injected when a new sandbox is created */
const DEFAULT_FILES = {
  // ── Entry point (react-ts template uses App.tsx as the root) ──
  "/App.tsx": `import Component from "./component";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        padding: "2rem",
      }}
    >
      <Component />
    </div>
  );
}
`,

  // ── Main component to edit ──────────────────────────────────
  "/component.tsx": `import { useState } from "react";

/**
 * Your component — edit this file to get started!
 * You can import from npm (framer-motion, lucide-react, etc.)
 * and the preview on the right updates in real time.
 */
export default function Component() {
  const [count, setCount] = useState(0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
        color: "#fff",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", fontWeight: 900, margin: 0 }}>
        🚀 Hello from Sandbox!
      </h1>
      <p style={{ color: "#888", margin: 0 }}>
        Edit this file — the preview updates live.
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <button
          onClick={() => setCount((c) => c - 1)}
          style={btnStyle}
        >
          −
        </button>
        <span style={{ fontSize: "2rem", fontWeight: 900 }}>{count}</span>
        <button
          onClick={() => setCount((c) => c + 1)}
          style={{ ...btnStyle, background: "#6366f1" }}
        >
          +
        </button>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 12,
  border: "none",
  background: "#222",
  color: "#fff",
  fontSize: "1.25rem",
  fontWeight: 700,
  cursor: "pointer",
};
`,

  // ── Utils helper (no path alias — direct import only) ───────
  "/utils.ts": `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`,

  // ── Global styles ────────────────────────────────────────────
  "/styles.css": `* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #0a0a0a; color: #fff; }
`,
};

// ─────────────────────────────────────────────
// List all sandbox components for a user
// GET /api/sandbox?userId=123
// ─────────────────────────────────────────────
const listUserSandboxes = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }

  try {
    const result = await pool.query(
      `SELECT id, user_id, title, slug, description, category, status, visibility,
              views, code_copies, likes, created_at, updated_at
       FROM sandbox_components
       WHERE user_id = $1
       ORDER BY updated_at DESC`,
      [userId],
    );

    // Aggregate stats
    const rows = result.rows;
    const published = rows.filter((r) => r.status === "published").length;
    const drafts = rows.filter((r) => r.status === "draft").length;
    const totalViews = rows.reduce((sum, r) => sum + (r.views || 0), 0);
    const totalLikes = rows.reduce((sum, r) => sum + (r.likes || 0), 0);

    res.json({
      success: true,
      components: rows,
      stats: { published, drafts, totalViews, totalLikes },
    });
  } catch (err) {
    console.error("Error listing sandboxes:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// Get a single sandbox component (with files)
// GET /api/sandbox/:id
// ─────────────────────────────────────────────
const getSandbox = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM sandbox_components WHERE id = $1",
      [id],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Sandbox not found" });
    }

    res.json({ success: true, component: result.rows[0] });
  } catch (err) {
    console.error("Error fetching sandbox:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// Create a new sandbox component
// POST /api/sandbox
// Body: { userId }
// ─────────────────────────────────────────────
const createSandbox = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO sandbox_components (user_id, title, files)
       VALUES ($1, $2, $3::jsonb)
       RETURNING *`,
      [userId, "Untitled", JSON.stringify(DEFAULT_FILES)],
    );

    res.status(201).json({ success: true, component: result.rows[0] });
  } catch (err) {
    console.error("Error creating sandbox:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// Autosave / update sandbox metadata + files
// PUT /api/sandbox/:id
// Body: { files?, title?, description? }
// ─────────────────────────────────────────────
const updateSandbox = async (req, res) => {
  const { id } = req.params;
  const { files, title, description } = req.body;

  try {
    const result = await pool.query(
      `UPDATE sandbox_components
       SET files = COALESCE($1::jsonb, files),
           title = COALESCE($2, title),
           description = COALESCE($3, description),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [
        files ? JSON.stringify(files) : null,
        title || null,
        description !== undefined ? description : null,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Sandbox not found" });
    }

    res.json({ success: true, component: result.rows[0] });
  } catch (err) {
    console.error("Error updating sandbox:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// Delete a sandbox component
// DELETE /api/sandbox/:id
// ─────────────────────────────────────────────
const deleteSandbox = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM sandbox_components WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Sandbox not found" });
    }

    res.json({ success: true, message: "Sandbox deleted successfully" });
  } catch (err) {
    console.error("Error deleting sandbox:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// Publish / update publishing metadata
// POST /api/sandbox/:id/publish
// Body: { title, slug, description, category, visibility, status }
// ─────────────────────────────────────────────
const publishSandbox = async (req, res) => {
  const { id } = req.params;
  const { title, slug, description, category, visibility, status } = req.body;

  if (!title || !slug) {
    return res
      .status(400)
      .json({ success: false, message: "Title and slug are required" });
  }

  try {
    // Check slug uniqueness (excluding current record)
    if (slug) {
      const slugCheck = await pool.query(
        "SELECT id FROM sandbox_components WHERE slug = $1 AND id != $2",
        [slug, id],
      );
      if (slugCheck.rows.length > 0) {
        return res
          .status(400)
          .json({ success: false, message: "Slug already in use" });
      }
    }

    const newStatus = status || "review";
    const result = await pool.query(
      `UPDATE sandbox_components
       SET title = $1,
           slug = $2,
           description = $3,
           category = COALESCE($4, category),
           visibility = COALESCE($5, visibility),
           status = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [title, slug, description, category, visibility, newStatus, id],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Sandbox not found" });
    }

    res.json({ success: true, component: result.rows[0] });
  } catch (err) {
    console.error("Error publishing sandbox:", err);
    if (err.code === "23505") {
      return res
        .status(400)
        .json({ success: false, message: "Slug already in use" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// Track a view on a sandbox component (public)
// POST /api/sandbox/:id/view
// ─────────────────────────────────────────────
const trackView = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      "UPDATE sandbox_components SET views = views + 1 WHERE id = $1",
      [id],
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error tracking view:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// Track a code copy event
// POST /api/sandbox/:id/copy
// ─────────────────────────────────────────────
const trackCopy = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      "UPDATE sandbox_components SET code_copies = code_copies + 1 WHERE id = $1",
      [id],
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error tracking copy:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  listUserSandboxes,
  getSandbox,
  createSandbox,
  updateSandbox,
  deleteSandbox,
  publishSandbox,
  trackView,
  trackCopy,
};
