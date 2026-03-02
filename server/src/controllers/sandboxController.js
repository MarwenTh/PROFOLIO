const { pool } = require("../config/db");

/**
 * Get all components for a user
 */
exports.getUserComponents = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT * FROM sandbox_components WHERE user_id = $1 ORDER BY updated_at DESC",
      [userId],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching components:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get a single component by ID
 */
exports.getComponentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT * FROM sandbox_components WHERE id = $1 AND user_id = $2",
      [id, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Component not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching component:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Create or Update a component
 */
exports.saveComponent = async (req, res) => {
  try {
    const { id, title, slug, files, description, status, visibility } =
      req.body;
    const userId = req.user.id;

    if (id) {
      // Update
      const result = await pool.query(
        `UPDATE sandbox_components 
         SET title = $1, slug = $2, files = $3, description = $4, status = $5, visibility = $6, updated_at = CURRENT_TIMESTAMP
         WHERE id = $7 AND user_id = $8
         RETURNING *`,
        [
          title,
          slug,
          JSON.stringify(files),
          description,
          status || "draft",
          visibility || "private",
          id,
          userId,
        ],
      );

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Component not found or unauthorized" });
      }

      return res.json(result.rows[0]);
    } else {
      // Create
      const result = await pool.query(
        `INSERT INTO sandbox_components (user_id, title, slug, files, description, status, visibility)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          userId,
          title || "Untitled",
          slug,
          JSON.stringify(files),
          description,
          status || "draft",
          visibility || "private",
        ],
      );

      return res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error saving component:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete a component
 */
exports.deleteComponent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      "DELETE FROM sandbox_components WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Component not found or unauthorized" });
    }

    res.json({ message: "Component deleted successfully" });
  } catch (error) {
    console.error("Error deleting component:", error);
    res.status(500).json({ message: "Server error" });
  }
};
