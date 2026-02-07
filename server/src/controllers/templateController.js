const { pool } = require('../config/db');

/**
 * Get all templates with optional filtering
 */
const getTemplates = async (req, res) => {
  const { category, isPremium } = req.query;

  try {
    let query = 'SELECT * FROM templates WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (category) {
      query += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (isPremium !== undefined) {
      query += ` AND is_premium = $${paramCount}`;
      params.push(isPremium === 'true');
      paramCount++;
    }

    query += ' ORDER BY downloads DESC, created_at DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      templates: result.rows
    });
  } catch (err) {
    console.error('Error fetching templates:', err);
    res.status(500).json({ success: false, message: 'Server error fetching templates' });
  }
};

/**
 * Get a single template by ID
 */
const getTemplateById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM templates WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    res.json({
      success: true,
      template: result.rows[0]
    });
  } catch (err) {
    console.error('Error fetching template:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Get user's purchased templates
 */
const getUserTemplates = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT t.*, ut.purchased_at 
       FROM templates t
       INNER JOIN user_templates ut ON t.id = ut.template_id
       WHERE ut.user_id = $1
       ORDER BY ut.purchased_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      templates: result.rows
    });
  } catch (err) {
    console.error('Error fetching user templates:', err);
    res.status(500).json({ success: false, message: 'Server error fetching user templates' });
  }
};

/**
 * Use a template (clone to user's portfolio)
 */
const useTemplate = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { portfolioTitle } = req.body;

  try {
    // Get template
    const templateResult = await pool.query('SELECT * FROM templates WHERE id = $1', [id]);
    
    if (templateResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    const template = templateResult.rows[0];

    // Check if premium and user has purchased
    if (template.is_premium) {
      const purchaseCheck = await pool.query(
        'SELECT * FROM user_templates WHERE user_id = $1 AND template_id = $2',
        [userId, id]
      );

      if (purchaseCheck.rows.length === 0) {
        return res.status(403).json({ 
          success: false, 
          message: 'You must purchase this premium template first' 
        });
      }
    }

    // Create portfolio from template
    const slug = portfolioTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const portfolioResult = await pool.query(
      `INSERT INTO portfolios (user_id, title, slug, description, content, status) 
       VALUES ($1, $2, $3, $4, $5, 'draft') 
       RETURNING *`,
      [userId, portfolioTitle, slug, template.description, template.structure]
    );

    // Increment download count
    await pool.query(
      'UPDATE templates SET downloads = downloads + 1 WHERE id = $1',
      [id]
    );

    // Record usage for free templates
    if (!template.is_premium) {
      await pool.query(
        `INSERT INTO user_templates (user_id, template_id) 
         VALUES ($1, $2) 
         ON CONFLICT (user_id, template_id) DO NOTHING`,
        [userId, id]
      );
    }

    res.status(201).json({
      success: true,
      portfolio: portfolioResult.rows[0],
      message: 'Portfolio created from template successfully'
    });
  } catch (err) {
    console.error('Error using template:', err);
    if (err.code === '23505') {
      return res.status(400).json({ 
        success: false, 
        message: 'A portfolio with this slug already exists. Please choose a different title.' 
      });
    }
    res.status(500).json({ success: false, message: 'Server error creating portfolio from template' });
  }
};

/**
 * Purchase a premium template
 */
const purchaseTemplate = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Check if template exists and is premium
    const templateResult = await pool.query(
      'SELECT * FROM templates WHERE id = $1 AND is_premium = true',
      [id]
    );

    if (templateResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Premium template not found' 
      });
    }

    // Check if already purchased
    const existingPurchase = await pool.query(
      'SELECT * FROM user_templates WHERE user_id = $1 AND template_id = $2',
      [userId, id]
    );

    if (existingPurchase.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already purchased this template' 
      });
    }

    // Record purchase (in real app, this would happen after payment)
    await pool.query(
      'INSERT INTO user_templates (user_id, template_id) VALUES ($1, $2)',
      [userId, id]
    );

    res.json({
      success: true,
      message: 'Template purchased successfully'
    });
  } catch (err) {
    console.error('Error purchasing template:', err);
    res.status(500).json({ success: false, message: 'Server error processing purchase' });
  }
};

module.exports = {
  getTemplates,
  getTemplateById,
  getUserTemplates,
  useTemplate,
  purchaseTemplate
};
