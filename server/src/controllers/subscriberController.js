const { pool } = require('../config/db');

// Get all subscribers for a portfolio
const getSubscribers = async (req, res) => {
  try {
    const userId = req.user.id;
    const { portfolioId } = req.query;
    
    if (!portfolioId) {
      return res.status(400).json({ success: false, message: 'Portfolio ID is required' });
    }
    
    // Verify ownership
    const ownerCheck = await pool.query(
      'SELECT user_id FROM portfolios WHERE id = $1',
      [portfolioId]
    );
    
    if (ownerCheck.rows.length === 0 || ownerCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    const result = await pool.query(
      `SELECT * FROM subscribers 
       WHERE portfolio_id = $1 
       ORDER BY subscribed_at DESC`,
      [portfolioId]
    );
    
    res.json({ success: true, subscribers: result.rows });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch subscribers' });
  }
};

// Add subscriber (public endpoint for portfolio visitors)
const addSubscriber = async (req, res) => {
  try {
    const { portfolioId, email, name } = req.body;
    
    if (!portfolioId || !email) {
      return res.status(400).json({ success: false, message: 'Portfolio ID and email are required' });
    }
    
    // Check if already subscribed
    const existing = await pool.query(
      'SELECT id, status FROM subscribers WHERE portfolio_id = $1 AND email = $2',
      [portfolioId, email]
    );
    
    if (existing.rows.length > 0) {
      if (existing.rows[0].status === 'active') {
        return res.status(400).json({ success: false, message: 'Email already subscribed' });
      }
      // Reactivate if previously unsubscribed
      await pool.query(
        'UPDATE subscribers SET status = $1, subscribed_at = CURRENT_TIMESTAMP, unsubscribed_at = NULL WHERE id = $2',
        ['active', existing.rows[0].id]
      );
      return res.json({ success: true, message: 'Subscription reactivated' });
    }
    
    const result = await pool.query(
      `INSERT INTO subscribers (portfolio_id, email, name, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [portfolioId, email, name, 'active']
    );
    
    res.json({ success: true, subscriber: result.rows[0] });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    res.status(500).json({ success: false, message: 'Failed to add subscriber' });
  }
};

// Remove subscriber
const removeSubscriber = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Verify ownership
    const ownerCheck = await pool.query(
      `SELECT s.portfolio_id, p.user_id 
       FROM subscribers s
       JOIN portfolios p ON s.portfolio_id = p.id
       WHERE s.id = $1`,
      [id]
    );
    
    if (ownerCheck.rows.length === 0 || ownerCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    await pool.query('DELETE FROM subscribers WHERE id = $1', [id]);
    res.json({ success: true, message: 'Subscriber removed successfully' });
  } catch (error) {
    console.error('Error removing subscriber:', error);
    res.status(500).json({ success: false, message: 'Failed to remove subscriber' });
  }
};

// Unsubscribe (public endpoint)
const unsubscribe = async (req, res) => {
  try {
    const { portfolioId, email } = req.body;
    
    if (!portfolioId || !email) {
      return res.status(400).json({ success: false, message: 'Portfolio ID and email are required' });
    }
    
    const result = await pool.query(
      `UPDATE subscribers 
       SET status = $1, unsubscribed_at = CURRENT_TIMESTAMP 
       WHERE portfolio_id = $2 AND email = $3
       RETURNING *`,
      ['unsubscribed', portfolioId, email]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Subscriber not found' });
    }
    
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ success: false, message: 'Failed to unsubscribe' });
  }
};

// Import subscribers from CSV
const importSubscribers = async (req, res) => {
  try {
    const userId = req.user.id;
    const { portfolioId, subscribers } = req.body;
    
    if (!portfolioId || !subscribers || !Array.isArray(subscribers)) {
      return res.status(400).json({ success: false, message: 'Invalid data' });
    }
    
    // Verify ownership
    const ownerCheck = await pool.query(
      'SELECT user_id FROM portfolios WHERE id = $1',
      [portfolioId]
    );
    
    if (ownerCheck.rows.length === 0 || ownerCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    let imported = 0;
    let skipped = 0;
    
    for (const sub of subscribers) {
      if (!sub.email) continue;
      
      try {
        await pool.query(
          `INSERT INTO subscribers (portfolio_id, email, name, status)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (portfolio_id, email) DO NOTHING`,
          [portfolioId, sub.email, sub.name || null, 'active']
        );
        imported++;
      } catch (err) {
        skipped++;
      }
    }
    
    res.json({ success: true, imported, skipped });
  } catch (error) {
    console.error('Error importing subscribers:', error);
    res.status(500).json({ success: false, message: 'Failed to import subscribers' });
  }
};

// Get newsletters
const getNewsletters = async (req, res) => {
  try {
    const userId = req.user.id;
    const { portfolioId } = req.query;
    
    let query = 'SELECT * FROM newsletters WHERE user_id = $1';
    const params = [userId];
    
    if (portfolioId) {
      query += ' AND portfolio_id = $2';
      params.push(portfolioId);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    res.json({ success: true, newsletters: result.rows });
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch newsletters' });
  }
};

// Create newsletter
const createNewsletter = async (req, res) => {
  try {
    const userId = req.user.id;
    const { portfolioId, subject, content } = req.body;
    
    if (!subject || !content) {
      return res.status(400).json({ success: false, message: 'Subject and content are required' });
    }
    
    const result = await pool.query(
      `INSERT INTO newsletters (user_id, portfolio_id, subject, content, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, portfolioId, subject, content, 'draft']
    );
    
    res.json({ success: true, newsletter: result.rows[0] });
  } catch (error) {
    console.error('Error creating newsletter:', error);
    res.status(500).json({ success: false, message: 'Failed to create newsletter' });
  }
};

// Send newsletter
const sendNewsletter = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Get newsletter
    const newsletter = await pool.query(
      'SELECT * FROM newsletters WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    if (newsletter.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Newsletter not found' });
    }
    
    const nl = newsletter.rows[0];
    
    if (nl.status === 'sent') {
      return res.status(400).json({ success: false, message: 'Newsletter already sent' });
    }
    
    // Get active subscribers
    const subscribers = await pool.query(
      'SELECT email FROM subscribers WHERE portfolio_id = $1 AND status = $2',
      [nl.portfolio_id, 'active']
    );
    
    // TODO: Integrate with email service (SendGrid, Mailgun, etc.)
    // For now, just mark as sent
    
    await pool.query(
      `UPDATE newsletters 
       SET status = $1, sent_at = CURRENT_TIMESTAMP, sent_to = $2
       WHERE id = $3`,
      ['sent', subscribers.rows.length, id]
    );
    
    res.json({ 
      success: true, 
      message: `Newsletter sent to ${subscribers.rows.length} subscribers`,
      sentTo: subscribers.rows.length
    });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    res.status(500).json({ success: false, message: 'Failed to send newsletter' });
  }
};

// Delete newsletter
const deleteNewsletter = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM newsletters WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Newsletter not found' });
    }
    
    res.json({ success: true, message: 'Newsletter deleted successfully' });
  } catch (error) {
    console.error('Error deleting newsletter:', error);
    res.status(500).json({ success: false, message: 'Failed to delete newsletter' });
  }
};

module.exports = {
  getSubscribers,
  addSubscriber,
  removeSubscriber,
  unsubscribe,
  importSubscribers,
  getNewsletters,
  createNewsletter,
  sendNewsletter,
  deleteNewsletter
};
