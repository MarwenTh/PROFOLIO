const { pool } = require('../config/db');

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
  const { filename, originalName, fileType, fileSize, url, folder } = req.body;
  const userId = req.user.id;

  if (!filename || !url) {
    return res.status(400).json({ success: false, message: 'Filename and URL are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO media_library (user_id, filename, original_name, file_type, file_size, url, folder)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, filename, originalName, fileType, fileSize, url, folder || 'root']
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

    res.json({
      success: true,
      message: 'Media deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting media:', err);
    res.status(500).json({ success: false, message: 'Server error deleting media' });
  }
};

module.exports = {
  getMedia,
  addMedia,
  deleteMedia
};
