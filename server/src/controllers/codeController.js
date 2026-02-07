const { pool } = require('../config/db');

// Get all code snippets
const getCodeSnippets = async (req, res) => {
  try {
    const userId = req.user.id;
    const { portfolioId } = req.query;
    
    let query = 'SELECT * FROM code_snippets WHERE user_id = $1';
    const params = [userId];
    
    if (portfolioId) {
      query += ' AND portfolio_id = $2';
      params.push(portfolioId);
    }
    
    query += ' ORDER BY updated_at DESC';
    
    const result = await pool.query(query, params);
    res.json({ success: true, snippets: result.rows });
  } catch (error) {
    console.error('Error fetching code snippets:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch code snippets' });
  }
};

// Create code snippet
const createSnippet = async (req, res) => {
  try {
    const userId = req.user.id;
    const { portfolioId, title, language, code, isPublic } = req.body;
    
    if (!language || !code) {
      return res.status(400).json({ success: false, message: 'Language and code are required' });
    }
    
    const result = await pool.query(
      `INSERT INTO code_snippets (user_id, portfolio_id, title, language, code, is_public)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, portfolioId, title, language, code, isPublic || false]
    );
    
    res.json({ success: true, snippet: result.rows[0] });
  } catch (error) {
    console.error('Error creating code snippet:', error);
    res.status(500).json({ success: false, message: 'Failed to create code snippet' });
  }
};

// Update code snippet
const updateSnippet = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { portfolioId, title, language, code, isPublic } = req.body;
    
    // Check ownership
    const ownerCheck = await pool.query(
      'SELECT user_id FROM code_snippets WHERE id = $1',
      [id]
    );
    
    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Snippet not found' });
    }
    
    if (ownerCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    const result = await pool.query(
      `UPDATE code_snippets 
       SET portfolio_id = COALESCE($1, portfolio_id),
           title = COALESCE($2, title),
           language = COALESCE($3, language),
           code = COALESCE($4, code),
           is_public = COALESCE($5, is_public),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [portfolioId, title, language, code, isPublic, id]
    );
    
    res.json({ success: true, snippet: result.rows[0] });
  } catch (error) {
    console.error('Error updating code snippet:', error);
    res.status(500).json({ success: false, message: 'Failed to update code snippet' });
  }
};

// Delete code snippet
const deleteSnippet = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM code_snippets WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Snippet not found' });
    }
    
    res.json({ success: true, message: 'Snippet deleted successfully' });
  } catch (error) {
    console.error('Error deleting code snippet:', error);
    res.status(500).json({ success: false, message: 'Failed to delete code snippet' });
  }
};

// Get public snippets (for sharing)
const getPublicSnippets = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT cs.*, u.name as author_name
       FROM code_snippets cs
       JOIN users u ON cs.user_id = u.id
       WHERE cs.is_public = true
       ORDER BY cs.created_at DESC
       LIMIT 50`
    );
    
    res.json({ success: true, snippets: result.rows });
  } catch (error) {
    console.error('Error fetching public snippets:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch public snippets' });
  }
};

module.exports = {
  getCodeSnippets,
  createSnippet,
  updateSnippet,
  deleteSnippet,
  getPublicSnippets
};
