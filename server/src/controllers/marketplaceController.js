const { pool } = require("../config/db");

// Get all marketplace items (browse)
const getMarketplaceItems = async (req, res) => {
  try {
    const {
      type,
      status = "published",
      search,
      minPrice,
      maxPrice,
    } = req.query;

    let query = `
      SELECT 
        mi.*,
        u.name as seller_name,
        u.email as seller_email,
        COUNT(DISTINCT mp.id) as total_purchases
      FROM marketplace_items mi
      LEFT JOIN users u ON mi.seller_id = u.id
      LEFT JOIN marketplace_purchases mp ON mi.id = mp.item_id
      WHERE mi.status = $1
    `;

    const params = [status];
    let paramIndex = 2;

    if (type) {
      query += ` AND mi.type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    if (search) {
      query += ` AND (mi.title ILIKE $${paramIndex} OR mi.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (minPrice) {
      query += ` AND mi.price >= $${paramIndex}`;
      params.push(minPrice);
      paramIndex++;
    }

    if (maxPrice) {
      query += ` AND mi.price <= $${paramIndex}`;
      params.push(maxPrice);
      paramIndex++;
    }

    query += ` GROUP BY mi.id, u.name, u.email ORDER BY mi.created_at DESC`;

    const result = await pool.query(query, params);
    res.json({ success: true, items: result.rows });
  } catch (error) {
    console.error("Error fetching marketplace items:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch marketplace items" });
  }
};

// Get seller's creations
const getMyCreations = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT 
        mi.*,
        COUNT(DISTINCT mp.id) as total_sales,
        COALESCE(SUM(mp.amount), 0) as total_revenue
      FROM marketplace_items mi
      LEFT JOIN marketplace_purchases mp ON mi.id = mp.item_id AND mp.payment_status = 'completed'
      WHERE mi.seller_id = $1
      GROUP BY mi.id
      ORDER BY mi.created_at DESC`,
      [userId],
    );

    res.json({ success: true, items: result.rows });
  } catch (error) {
    console.error("Error fetching my creations:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch your creations" });
  }
};

// Create marketplace item
const createItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      portfolio_id,
      type,
      title,
      description,
      price,
      preview_images,
      content,
      status = "draft",
    } = req.body;

    if (!title || !type || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Title, type, and price are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO marketplace_items 
        (seller_id, portfolio_id, type, title, description, price, preview_images, content, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        userId,
        portfolio_id,
        type,
        title,
        description,
        price,
        JSON.stringify(preview_images || []),
        JSON.stringify(content || {}),
        status,
      ],
    );

    res.json({ success: true, item: result.rows[0] });
  } catch (error) {
    console.error("Error creating marketplace item:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create marketplace item" });
  }
};

// Update marketplace item
const updateItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const {
      portfolio_id,
      type,
      title,
      description,
      price,
      preview_images,
      content,
      status,
    } = req.body;

    // Check ownership
    const ownerCheck = await pool.query(
      "SELECT seller_id FROM marketplace_items WHERE id = $1",
      [id],
    );
    if (ownerCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    if (ownerCheck.rows[0].seller_id !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const result = await pool.query(
      `UPDATE marketplace_items 
      SET portfolio_id = COALESCE($1, portfolio_id),
          type = COALESCE($2, type),
          title = COALESCE($3, title),
          description = COALESCE($4, description),
          price = COALESCE($5, price),
          preview_images = COALESCE($6, preview_images),
          content = COALESCE($7, content),
          status = COALESCE($8, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *`,
      [
        portfolio_id !== undefined ? portfolio_id : null,
        type !== undefined ? type : null,
        title !== undefined ? title : null,
        description !== undefined ? description : null,
        price !== undefined ? price : null,
        preview_images ? JSON.stringify(preview_images) : null,
        content ? JSON.stringify(content) : null,
        status !== undefined ? status : null,
        id,
      ],
    );

    res.json({ success: true, item: result.rows[0] });
  } catch (error) {
    console.error("Error updating marketplace item:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update marketplace item" });
  }
};

// Delete marketplace item
const deleteItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Check ownership
    const ownerCheck = await pool.query(
      "SELECT seller_id FROM marketplace_items WHERE id = $1",
      [id],
    );
    if (ownerCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    if (ownerCheck.rows[0].seller_id !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await pool.query("DELETE FROM marketplace_items WHERE id = $1", [id]);
    res.json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting marketplace item:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete marketplace item" });
  }
};

// Purchase item
const purchaseItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Get item details
    const itemResult = await pool.query(
      "SELECT * FROM marketplace_items WHERE id = $1 AND status = $2",
      [id, "published"],
    );
    if (itemResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found or not available" });
    }

    const item = itemResult.rows[0];

    // Check if already purchased
    const existingPurchase = await pool.query(
      "SELECT id FROM marketplace_purchases WHERE buyer_id = $1 AND item_id = $2",
      [userId, id],
    );

    if (existingPurchase.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already purchased this item",
      });
    }

    // Create purchase record (in real app, integrate with payment gateway)
    const result = await pool.query(
      `INSERT INTO marketplace_purchases (buyer_id, item_id, amount, payment_status)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [userId, id, item.price, "completed"], // In production, this would be 'pending' until payment confirms
    );

    // Increment downloads counter
    await pool.query(
      "UPDATE marketplace_items SET downloads = downloads + 1 WHERE id = $1",
      [id],
    );

    res.json({ success: true, purchase: result.rows[0], item });
  } catch (error) {
    console.error("Error purchasing item:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to purchase item" });
  }
};

// Get user's purchases
const getMyPurchases = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT 
        mp.*,
        mi.title,
        mi.description,
        mi.type,
        mi.preview_images,
        mi.content,
        u.name as seller_name
      FROM marketplace_purchases mp
      JOIN marketplace_items mi ON mp.item_id = mi.id
      JOIN users u ON mi.seller_id = u.id
      WHERE mp.buyer_id = $1
      ORDER BY mp.purchased_at DESC`,
      [userId],
    );

    res.json({ success: true, purchases: result.rows });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch purchases" });
  }
};

// Save/bookmark item
const saveItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Check if already saved
    const existing = await pool.query(
      "SELECT id FROM marketplace_saves WHERE user_id = $1 AND item_id = $2",
      [userId, id],
    );

    if (existing.rows.length > 0) {
      // Unsave
      await pool.query(
        "DELETE FROM marketplace_saves WHERE user_id = $1 AND item_id = $2",
        [userId, id],
      );
      return res.json({
        success: true,
        saved: false,
        message: "Item removed from saved",
      });
    }

    // Save
    await pool.query(
      "INSERT INTO marketplace_saves (user_id, item_id) VALUES ($1, $2)",
      [userId, id],
    );

    res.json({
      success: true,
      saved: true,
      message: "Item saved successfully",
    });
  } catch (error) {
    console.error("Error saving item:", error);
    res.status(500).json({ success: false, message: "Failed to save item" });
  }
};

// Get user's saved items
const getMySavedItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT 
        ms.saved_at,
        mi.*,
        u.name as seller_name
      FROM marketplace_saves ms
      JOIN marketplace_items mi ON ms.item_id = mi.id
      JOIN users u ON mi.seller_id = u.id
      WHERE ms.user_id = $1 AND mi.status = 'published'
      ORDER BY ms.saved_at DESC`,
      [userId],
    );

    res.json({ success: true, items: result.rows });
  } catch (error) {
    console.error("Error fetching saved items:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch saved items" });
  }
};

// Integrate an item into workspace
const integrateItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Check if the user owns or purchased the item, OR if it's a free item.
    // For simplicity, let's check if the item is free or if the user purchased it/created it.
    const itemQuery = `
      SELECT mi.*, 
        EXISTS(SELECT 1 FROM marketplace_purchases WHERE buyer_id = $1 AND item_id = mi.id) as is_purchased
      FROM marketplace_items mi 
      WHERE mi.id = $2 AND mi.status = 'published'
    `;
    const itemResult = await pool.query(itemQuery, [userId, id]);

    if (itemResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    const item = itemResult.rows[0];
    const canIntegrate =
      item.seller_id === userId || item.price == 0 || item.is_purchased;

    if (!canIntegrate) {
      return res
        .status(403)
        .json({ success: false, message: "You must purchase this item first" });
    }

    if (item.type === "portfolio") {
      // Create a new portfolio based on this item
      // We need a unique slug
      const slug = `integrated-${item.id}-${Date.now()}`;

      const newPortfolio = await pool.query(
        `INSERT INTO portfolios (user_id, title, slug, description, content) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
          userId,
          `${item.title} (Clone)`,
          slug,
          `Integrated from Marketplace: ${item.title}`,
          item.content,
        ],
      );

      return res.json({
        success: true,
        message: "Portfolio integrated successfully",
        portfolio: newPortfolio.rows[0],
      });
    } else {
      // For components/themes/animations, they are just accessed via purchases.
      // We must ensure there's a record in marketplace_purchases if it doesn't exist
      if (!item.is_purchased && item.seller_id !== userId) {
        await pool.query(
          `INSERT INTO marketplace_purchases (buyer_id, item_id, amount, payment_status)
          VALUES ($1, $2, $3, $4)`,
          [userId, id, item.price || 0, "completed"],
        );

        // Increment downloads counter
        await pool.query(
          "UPDATE marketplace_items SET downloads = downloads + 1 WHERE id = $1",
          [id],
        );
      }

      return res.json({
        success: true,
        message: "Item available in your library",
      });
    }
  } catch (error) {
    console.error("Error integrating item:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to integrate item" });
  }
};

module.exports = {
  getMarketplaceItems,
  getMyCreations,
  createItem,
  updateItem,
  deleteItem,
  purchaseItem,
  getMyPurchases,
  saveItem,
  getMySavedItems,
  integrateItem,
};
