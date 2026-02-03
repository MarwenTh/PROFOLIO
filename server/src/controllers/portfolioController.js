const { pool } = require('../config/db');

const getUserPortfolios = async (req, res) => {
  const { userId } = req.query; // For now we pass userId in query, later we'll use JWT/Session

  if (!userId) {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM portfolios WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      success: true,
      portfolios: result.rows
    });
  } catch (err) {
    console.error('Error fetching portfolios:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createPortfolio = async (req, res) => {
  const { userId, title, slug, description } = req.body;

  if (!userId || !title || !slug) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO portfolios (user_id, title, slug, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, title, slug, description]
    );

    res.status(201).json({
      success: true,
      portfolio: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating portfolio:', err);
    if (err.code === '23505') {
      return res.status(400).json({ success: false, message: 'Slug already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getPortfolioById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM portfolios WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    res.json({
      success: true,
      portfolio: result.rows[0]
    });
  } catch (err) {
    console.error('Error fetching portfolio:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updatePortfolio = async (req, res) => {
  const { id } = req.params;
  const { title, description, content, status } = req.body;
  
  console.log('Update Portfolio Request:', { id, title, description, status, contentType: typeof content });
  if (content && typeof content === 'object') {
    console.log('Content Structure:', Object.keys(content));
  }

  try {
    const result = await pool.query(
      `UPDATE portfolios 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description), 
           content = COALESCE($3::jsonb, content), 
           status = COALESCE($4, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 RETURNING *`,
      [title, description, content ? JSON.stringify(content) : null, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    res.json({
      success: true,
      portfolio: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating portfolio:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getPortfolioBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const result = await pool.query('SELECT * FROM portfolios WHERE slug = $1', [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    res.json({
      success: true,
      portfolio: result.rows[0]
    });
  } catch (err) {
    console.error('Error fetching portfolio by slug:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getUserPortfolios,
  createPortfolio,
  getPortfolioById,
  updatePortfolio,
  getPortfolioBySlug
};
