const { pool } = require('../config/db');

/**
 * Get SEO settings for a portfolio
 */
const getSeoSettings = async (req, res) => {
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
      'SELECT * FROM portfolio_seo WHERE portfolio_id = $1',
      [portfolioId]
    );

    res.json({
      success: true,
      seo: result.rows[0] || null
    });
  } catch (err) {
    console.error('Error fetching SEO settings:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Update SEO settings for a portfolio
 */
const updateSeoSettings = async (req, res) => {
  const { portfolioId } = req.params;
  const {
    metaTitle,
    metaDescription,
    metaKeywords,
    ogImage,
    ogTitle,
    ogDescription,
    twitterCard,
    canonicalUrl,
    robots
  } = req.body;
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
      `INSERT INTO portfolio_seo 
       (portfolio_id, meta_title, meta_description, meta_keywords, og_image, og_title, og_description, twitter_card, canonical_url, robots)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (portfolio_id)
       DO UPDATE SET
         meta_title = COALESCE($2, portfolio_seo.meta_title),
         meta_description = COALESCE($3, portfolio_seo.meta_description),
         meta_keywords = COALESCE($4, portfolio_seo.meta_keywords),
         og_image = COALESCE($5, portfolio_seo.og_image),
         og_title = COALESCE($6, portfolio_seo.og_title),
         og_description = COALESCE($7, portfolio_seo.og_description),
         twitter_card = COALESCE($8, portfolio_seo.twitter_card),
         canonical_url = COALESCE($9, portfolio_seo.canonical_url),
         robots = COALESCE($10, portfolio_seo.robots),
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [portfolioId, metaTitle, metaDescription, metaKeywords, ogImage, ogTitle, ogDescription, twitterCard, canonicalUrl, robots]
    );

    res.json({
      success: true,
      seo: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating SEO settings:', err);
    res.status(500).json({ success: false, message: 'Server error updating SEO' });
  }
};

module.exports = {
  getSeoSettings,
  updateSeoSettings
};
