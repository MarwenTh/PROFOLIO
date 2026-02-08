const { pool } = require('../config/db');
const axios = require('axios');

/**
 * Search Unsplash
 */
const searchUnsplash = async (req, res) => {
  const { query, page = 1, per_page = 20 } = req.query;
  
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    return res.status(500).json({ success: false, message: 'Unsplash API key not configured' });
  }

  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: { query, page, per_page },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
      }
    });

    res.json({
      success: true,
      results: response.data.results,
      total: response.data.total,
      total_pages: response.data.total_pages
    });
  } catch (err) {
    console.error('Error searching Unsplash:', err.response?.data || err.message);
    res.status(500).json({ success: false, message: 'Error searching Unsplash' });
  }
};

/**
 * Get all media files for a user
 */
const getMedia = async (req, res) => {
  const userId = req.user.id;
  const { folder } = req.query;

  try {
    let query = 'SELECT * FROM media_library WHERE user_id = $1';
    const params = [userId];

    if (folder) {
      query += ' AND folder = $2';
      params.push(folder);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      media: result.rows
    });
  } catch (err) {
    console.error('Error fetching media:', err);
    res.status(500).json({ success: false, message: 'Server error fetching media' });
  }
};

/**
 * Add media file (URL-based for now)
 */
const addMedia = async (req, res) => {
  const { filename, originalName, fileType, fileSize, url, folder, width, height, blur_hash, unsplash_id } = req.body;
  const userId = req.user.id;

  if (!filename || !url) {
    return res.status(400).json({ success: false, message: 'Filename and URL are required' });
  }

  try {
    // Check if unsplash photo already exists
    if (unsplash_id) {
      const existing = await pool.query(
        'SELECT * FROM media_library WHERE user_id = $1 AND unsplash_id = $2',
        [userId, unsplash_id]
      );
      if (existing.rows.length > 0) {
        return res.json({ success: true, media: existing.rows[0], message: 'Photo already in library' });
      }
    }

    const result = await pool.query(
      `INSERT INTO media_library (user_id, filename, original_name, file_type, file_size, url, folder, width, height, blur_hash, unsplash_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [userId, filename, originalName, fileType, fileSize, url, folder || 'root', width, height, blur_hash, unsplash_id]
    );

    res.status(201).json({
      success: true,
      media: result.rows[0]
    });
  } catch (err) {
    console.error('Error adding media:', err);
    res.status(500).json({ success: false, message: 'Server error adding media' });
  }
};

/**
 * Delete media file
 */
const deleteMedia = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'DELETE FROM media_library WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    // Also remove from collections (cascade should handle this, but good to be safe/aware)
    
    res.json({
      success: true,
      message: 'Media deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting media:', err);
    res.status(500).json({ success: false, message: 'Server error deleting media' });
  }
};

/**
 * Create Collection
 */
const createCollection = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id; // Corrected

  if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

  try {
    const result = await pool.query(
      'INSERT INTO collections (user_id, name, description) VALUES ($1, $2, $3) RETURNING *',
      [userId, name, description]
    );
    res.status(201).json({ success: true, collection: result.rows[0] });
  } catch (err) {
    console.error('Error creating collection:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Get Collections
 */
const getCollections = async (req, res) => {
  const userId = req.user.id; // Corrected
  try {
    // Get collections with item count and preview image
    const query = `
      SELECT c.*, 
        COUNT(ci.media_id) as item_count,
        (SELECT url FROM media_library m JOIN collection_items ci2 ON m.id = ci2.media_id WHERE ci2.collection_id = c.id ORDER BY ci2.added_at DESC LIMIT 1) as preview_image
      FROM collections c
      LEFT JOIN collection_items ci ON c.id = ci.collection_id
      WHERE c.user_id = $1
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    res.json({ success: true, collections: result.rows });
  } catch (err) {
    console.error('Error getting collections:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Add Media to Collection
 */
const addToCollection = async (req, res) => {
  const { id } = req.params; // collectionId
  const { mediaId } = req.body;
  const userId = req.user.id;

  try {
    // Verify ownership
    const collection = await pool.query('SELECT * FROM collections WHERE id = $1 AND user_id = $2', [id, userId]);
    if (collection.rows.length === 0) return res.status(404).json({ success: false, message: 'Collection not found' });

    await pool.query(
      'INSERT INTO collection_items (collection_id, media_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [id, mediaId]
    );

    res.json({ success: true, message: 'Added to collection' });
  } catch (err) {
    console.error('Error adding to collection:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Remove from Collection
 */
const removeFromCollection = async (req, res) => {
  const { id, mediaId } = req.params;
  const userId = req.user.id;

  try {
    // Verify ownership
    const collection = await pool.query('SELECT * FROM collections WHERE id = $1 AND user_id = $2', [id, userId]);
    if (collection.rows.length === 0) return res.status(404).json({ success: false, message: 'Collection not found' });

    await pool.query(
      'DELETE FROM collection_items WHERE collection_id = $1 AND media_id = $2',
      [id, mediaId]
    );

    res.json({ success: true, message: 'Removed from collection' });
  } catch (err) {
    console.error('Error removing from collection:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Get Collection Items
 */
const getCollectionItems = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
  
    try {
      const collection = await pool.query('SELECT * FROM collections WHERE id = $1 AND user_id = $2', [id, userId]);
      if (collection.rows.length === 0) return res.status(404).json({ success: false, message: 'Collection not found' });
  
      const items = await pool.query(
        `SELECT m.*, ci.added_at 
         FROM media_library m 
         JOIN collection_items ci ON m.id = ci.media_id 
         WHERE ci.collection_id = $1 
         ORDER BY ci.added_at DESC`,
        [id]
      );
  
      res.json({ success: true, collection: collection.rows[0], items: items.rows });
    } catch (err) {
      console.error('Error getting collection items:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

/**
 * Get Search History
 */
const getSearchHistory = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      'SELECT query FROM search_history WHERE user_id = $1 GROUP BY query ORDER BY MAX(created_at) DESC LIMIT 10',
      [userId]
    );
    res.json({ success: true, history: result.rows.map(r => r.query) });
  } catch (err) {
    console.error('Error getting search history:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Save Search History
 */
const saveSearchHistory = async (req, res) => {
  const { query } = req.body;
  const userId = req.user.id;

  if (!query) return res.status(400).json({ success: false, message: 'Query is required' });

  try {
    await pool.query(
      'INSERT INTO search_history (user_id, query) VALUES ($1, $2)',
      [userId, query]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving search history:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Update Collection
 */
const updateCollection = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'UPDATE collections SET name = COALESCE($1, name), description = COALESCE($2, description), updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *',
      [name, description, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    res.json({ success: true, collection: result.rows[0] });
  } catch (err) {
    console.error('Error updating collection:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Delete Collection
 */
const deleteCollection = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'DELETE FROM collections WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    res.json({ success: true, message: 'Collection deleted successfully' });
  } catch (err) {
    console.error('Error deleting collection:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getMedia,
  addMedia,
  deleteMedia,
  searchUnsplash,
  createCollection,
  getCollections,
  addToCollection,
  removeFromCollection,
  getCollectionItems,
  getSearchHistory,
  saveSearchHistory,
  updateCollection,
  deleteCollection
};
