const { pool } = require('../config/db');

/**
 * Update portfolio slug
 */
const updateSlug = async (req, res) => {
  const { portfolioId } = req.params;
  const { slug } = req.body;
  const userId = req.user.id;

  if (!slug) {
    return res.status(400).json({ success: false, message: 'Slug is required' });
  }

  // Validate slug format (lowercase, alphanumeric, hyphens only)
  const slugRegex = /^[a-z0-9-]+$/;
  if (!slugRegex.test(slug)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Slug must contain only lowercase letters, numbers, and hyphens' 
    });
  }

  try {
    // Verify ownership
    const portfolioCheck = await pool.query(
      'SELECT id, slug FROM portfolios WHERE id = $1 AND user_id = $2',
      [portfolioId, userId]
    );

    if (portfolioCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    // Check if slug is already taken
    const slugCheck = await pool.query(
      'SELECT id FROM portfolios WHERE slug = $1 AND id != $2',
      [slug, portfolioId]
    );

    if (slugCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Slug is already taken' });
    }

    // Update slug
    const result = await pool.query(
      'UPDATE portfolios SET slug = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [slug, portfolioId]
    );

    res.json({
      success: true,
      portfolio: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating slug:', err);
    res.status(500).json({ success: false, message: 'Server error updating slug' });
  }
};

/**
 * Get domains for a portfolio
 */
const getDomains = async (req, res) => {
  const { portfolioId } = req.params;
  const userId = req.user.id;

  try {
    // Verify ownership
    const portfolioCheck = await pool.query(
      'SELECT id FROM portfolios WHERE id = $1 AND user_id = $2',
      [portfolioId, userId]
    );

    if (portfolioCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    const result = await pool.query(
      'SELECT * FROM portfolio_domains WHERE portfolio_id = $1 ORDER BY is_primary DESC, created_at DESC',
      [portfolioId]
    );

    res.json({
      success: true,
      domains: result.rows
    });
  } catch (err) {
    console.error('Error fetching domains:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Add custom domain
 */
const addDomain = async (req, res) => {
  const { portfolioId } = req.params;
  const { domain } = req.body;
  const userId = req.user.id;

  if (!domain) {
    return res.status(400).json({ success: false, message: 'Domain is required' });
  }

  // Validate domain format
  const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;
  if (!domainRegex.test(domain)) {
    return res.status(400).json({ success: false, message: 'Invalid domain format' });
  }

  try {
    // Verify ownership
    const portfolioCheck = await pool.query(
      'SELECT id FROM portfolios WHERE id = $1 AND user_id = $2',
      [portfolioId, userId]
    );

    if (portfolioCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    // Check if domain already exists
    const domainCheck = await pool.query(
      'SELECT id FROM portfolio_domains WHERE domain = $1',
      [domain.toLowerCase()]
    );

    if (domainCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Domain already in use' });
    }

    // Generate verification code
    const verificationCode = Math.random().toString(36).substring(2, 15);

    const result = await pool.query(
      `INSERT INTO portfolio_domains (portfolio_id, domain, verification_code)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [portfolioId, domain.toLowerCase(), verificationCode]
    );

    res.status(201).json({
      success: true,
      domain: result.rows[0]
    });
  } catch (err) {
    console.error('Error adding domain:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Delete domain
 */
const deleteDomain = async (req, res) => {
  const { domainId } = req.params;
  const userId = req.user.id;

  try {
    // Verify ownership through portfolio
    const result = await pool.query(
      `DELETE FROM portfolio_domains pd
       USING portfolios p
       WHERE pd.id = $1 
       AND pd.portfolio_id = p.id 
       AND p.user_id = $2
       RETURNING pd.id`,
      [domainId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Domain not found' });
    }

    res.json({
      success: true,
      message: 'Domain deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting domain:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  updateSlug,
  getDomains,
  addDomain,
  deleteDomain
};
