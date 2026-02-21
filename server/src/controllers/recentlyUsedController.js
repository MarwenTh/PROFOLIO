const { pool } = require("../config/db");

/**
 * Get recently used items for a user by type
 */
const getRecentlyUsed = async (req, res) => {
  const userId = req.user.id;
  const { type } = req.query;

  if (!type) {
    return res
      .status(400)
      .json({ success: false, message: "Type is required" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM recently_used WHERE user_id = $1 AND type = $2 ORDER BY used_at DESC LIMIT 10",
      [userId, type],
    );

    res.json({
      success: true,
      items: result.rows,
    });
  } catch (err) {
    console.error("Error fetching recently used items:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Record usage of an item
 */
const recordUsage = async (req, res) => {
  const userId = req.user.id;
  const { type, content } = req.body;

  if (!type || !content) {
    return res
      .status(400)
      .json({ success: false, message: "Type and content are required" });
  }

  try {
    // Upsert: Update used_at if entry exists, otherwise insert
    const contentStr = JSON.stringify(content);

    await pool.query(
      `INSERT INTO recently_used (user_id, type, content)
       VALUES ($1, $2, $3::jsonb)
       ON CONFLICT (user_id, type, content)
       DO UPDATE SET used_at = CURRENT_TIMESTAMP`,
      [userId, type, contentStr],
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Error recording usage:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Delete a recently used item
 */
const deleteRecentlyUsed = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM recently_used WHERE id = $1 AND user_id = $2",
      [id, userId],
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    res.json({ success: true, message: "Item deleted" });
  } catch (err) {
    console.error("Error deleting recently used item:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getRecentlyUsed,
  recordUsage,
  deleteRecentlyUsed,
};
