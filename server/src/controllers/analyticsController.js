const { pool } = require('../config/db');

/**
 * Track a portfolio view (public endpoint)
 */
const trackView = async (req, res) => {
  const { portfolioId, referrer } = req.body;
  const visitorIp = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];

  if (!portfolioId) {
    return res.status(400).json({ success: false, message: 'Portfolio ID is required' });
  }

  try {
    // Record the view
    await pool.query(
      `INSERT INTO portfolio_views (portfolio_id, visitor_ip, user_agent, referrer) 
       VALUES ($1, $2, $3, $4)`,
      [portfolioId, visitorIp, userAgent, referrer || null]
    );

    // Update daily stats
    const today = new Date().toISOString().split('T')[0];
    
    await pool.query(
      `INSERT INTO portfolio_stats (portfolio_id, date, total_views, unique_visitors)
       VALUES ($1, $2, 1, 1)
       ON CONFLICT (portfolio_id, date)
       DO UPDATE SET 
         total_views = portfolio_stats.total_views + 1`,
      [portfolioId, today]
    );

    res.json({ success: true, message: 'View tracked' });
  } catch (err) {
    console.error('Error tracking view:', err);
    res.status(500).json({ success: false, message: 'Server error tracking view' });
  }
};

/**
 * Get analytics overview for user
 */
const getOverview = async (req, res) => {
  const userId = req.user.id;

  try {
    // Get total views across all portfolios
    const viewsResult = await pool.query(
      `SELECT COUNT(*) as total_views
       FROM portfolio_views pv
       INNER JOIN portfolios p ON pv.portfolio_id = p.id
       WHERE p.user_id = $1`,
      [userId]
    );

    // Get unique visitors (last 30 days)
    const visitorsResult = await pool.query(
      `SELECT COUNT(DISTINCT visitor_ip) as unique_visitors
       FROM portfolio_views pv
       INNER JOIN portfolios p ON pv.portfolio_id = p.id
       WHERE p.user_id = $1 
       AND pv.viewed_at >= NOW() - INTERVAL '30 days'`,
      [userId]
    );

    // Get portfolio count
    const portfoliosResult = await pool.query(
      'SELECT COUNT(*) as total_portfolios FROM portfolios WHERE user_id = $1',
      [userId]
    );

    // Get views trend (last 7 days)
    const trendResult = await pool.query(
      `SELECT 
         DATE(viewed_at) as date,
         COUNT(*) as views
       FROM portfolio_views pv
       INNER JOIN portfolios p ON pv.portfolio_id = p.id
       WHERE p.user_id = $1 
       AND pv.viewed_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(viewed_at)
       ORDER BY date DESC`,
      [userId]
    );

    res.json({
      success: true,
      overview: {
        totalViews: parseInt(viewsResult.rows[0].total_views),
        uniqueVisitors: parseInt(visitorsResult.rows[0].unique_visitors),
        totalPortfolios: parseInt(portfoliosResult.rows[0].total_portfolios),
        viewsTrend: trendResult.rows
      }
    });
  } catch (err) {
    console.error('Error fetching analytics overview:', err);
    res.status(500).json({ success: false, message: 'Server error fetching analytics' });
  }
};

/**
 * Get detailed analytics for a specific portfolio
 */
const getPortfolioAnalytics = async (req, res) => {
  const { portfolioId } = req.params;
  const { range = '30' } = req.query; // days
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

    // Get views over time
    const viewsOverTime = await pool.query(
      `SELECT 
         DATE(viewed_at) as date,
         COUNT(*) as views,
         COUNT(DISTINCT visitor_ip) as unique_visitors
       FROM portfolio_views
       WHERE portfolio_id = $1 
       AND viewed_at >= NOW() - INTERVAL '${parseInt(range)} days'
       GROUP BY DATE(viewed_at)
       ORDER BY date ASC`,
      [portfolioId]
    );

    // Get top referrers
    const topReferrers = await pool.query(
      `SELECT 
         COALESCE(referrer, 'Direct') as source,
         COUNT(*) as visits
       FROM portfolio_views
       WHERE portfolio_id = $1 
       AND viewed_at >= NOW() - INTERVAL '${parseInt(range)} days'
       GROUP BY referrer
       ORDER BY visits DESC
       LIMIT 10`,
      [portfolioId]
    );

    // Get geographic data
    const geoData = await pool.query(
      `SELECT 
         country,
         COUNT(*) as visits
       FROM portfolio_views
       WHERE portfolio_id = $1 
       AND country IS NOT NULL
       AND viewed_at >= NOW() - INTERVAL '${parseInt(range)} days'
       GROUP BY country
       ORDER BY visits DESC
       LIMIT 10`,
      [portfolioId]
    );

    // Get total stats
    const totalStats = await pool.query(
      `SELECT 
         COUNT(*) as total_views,
         COUNT(DISTINCT visitor_ip) as unique_visitors
       FROM portfolio_views
       WHERE portfolio_id = $1 
       AND viewed_at >= NOW() - INTERVAL '${parseInt(range)} days'`,
      [portfolioId]
    );

    res.json({
      success: true,
      analytics: {
        viewsOverTime: viewsOverTime.rows,
        topReferrers: topReferrers.rows,
        geoData: geoData.rows,
        totalViews: parseInt(totalStats.rows[0].total_views),
        uniqueVisitors: parseInt(totalStats.rows[0].unique_visitors)
      }
    });
  } catch (err) {
    console.error('Error fetching portfolio analytics:', err);
    res.status(500).json({ success: false, message: 'Server error fetching analytics' });
  }
};

/**
 * Get traffic sources breakdown
 */
const getTrafficSources = async (req, res) => {
  const userId = req.user.id;
  const { range = '30' } = req.query;

  try {
    const result = await pool.query(
      `SELECT 
         CASE 
           WHEN referrer IS NULL THEN 'Direct'
           WHEN referrer LIKE '%google%' THEN 'Google'
           WHEN referrer LIKE '%facebook%' THEN 'Facebook'
           WHEN referrer LIKE '%twitter%' THEN 'Twitter'
           WHEN referrer LIKE '%linkedin%' THEN 'LinkedIn'
           ELSE 'Other'
         END as source,
         COUNT(*) as visits
       FROM portfolio_views pv
       INNER JOIN portfolios p ON pv.portfolio_id = p.id
       WHERE p.user_id = $1 
       AND pv.viewed_at >= NOW() - INTERVAL '${parseInt(range)} days'
       GROUP BY source
       ORDER BY visits DESC`,
      [userId]
    );

    res.json({
      success: true,
      sources: result.rows
    });
  } catch (err) {
    console.error('Error fetching traffic sources:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  trackView,
  getOverview,
  getPortfolioAnalytics,
  getTrafficSources
};
