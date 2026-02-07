const { pool } = require('../config/db');
const crypto = require('crypto');

// Generate unique referral code
const generateReferralCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Get user's referral code
const getReferralCode = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if user already has a referral code
    let result = await pool.query(
      'SELECT referral_code FROM referrals WHERE referrer_id = $1 LIMIT 1',
      [userId]
    );
    
    let referralCode;
    if (result.rows.length > 0) {
      referralCode = result.rows[0].referral_code;
    } else {
      // Generate new code
      referralCode = generateReferralCode();
      await pool.query(
        'INSERT INTO referrals (referrer_id, referral_code, status) VALUES ($1, $2, $3)',
        [userId, referralCode, 'pending']
      );
    }
    
    res.json({ success: true, referralCode });
  } catch (error) {
    console.error('Error getting referral code:', error);
    res.status(500).json({ success: false, message: 'Failed to get referral code' });
  }
};

// Get user's referrals
const getReferrals = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      `SELECT 
        r.*,
        u.name as referred_user_name,
        u.email as referred_user_email
      FROM referrals r
      LEFT JOIN users u ON r.referred_user_id = u.id
      WHERE r.referrer_id = $1
      ORDER BY r.created_at DESC`,
      [userId]
    );
    
    // Get stats
    const stats = await pool.query(
      `SELECT 
        COUNT(*) as total_referrals,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_referrals,
        COALESCE(SUM(reward_amount), 0) as total_rewards
      FROM referrals
      WHERE referrer_id = $1`,
      [userId]
    );
    
    res.json({ 
      success: true, 
      referrals: result.rows,
      stats: stats.rows[0]
    });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch referrals' });
  }
};

// Send referral invite
const sendInvite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    // Get or create referral code
    let codeResult = await pool.query(
      'SELECT referral_code FROM referrals WHERE referrer_id = $1 LIMIT 1',
      [userId]
    );
    
    let referralCode;
    if (codeResult.rows.length > 0) {
      referralCode = codeResult.rows[0].referral_code;
    } else {
      referralCode = generateReferralCode();
    }
    
    // Create referral record
    await pool.query(
      `INSERT INTO referrals (referrer_id, referred_email, referral_code, status)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT DO NOTHING`,
      [userId, email, referralCode, 'pending']
    );
    
    // TODO: Send email with referral link
    // For now, just return success
    
    res.json({ 
      success: true, 
      message: 'Referral invite sent',
      referralCode
    });
  } catch (error) {
    console.error('Error sending invite:', error);
    res.status(500).json({ success: false, message: 'Failed to send invite' });
  }
};

// Track referral signup (called during user registration)
const trackReferralSignup = async (referralCode, newUserId) => {
  try {
    if (!referralCode) return;
    
    const result = await pool.query(
      `UPDATE referrals 
       SET referred_user_id = $1, 
           status = $2, 
           completed_at = CURRENT_TIMESTAMP,
           reward_amount = $3
       WHERE referral_code = $4 AND status = $5
       RETURNING *`,
      [newUserId, 'completed', 10.00, referralCode, 'pending']
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error tracking referral signup:', error);
  }
};

module.exports = {
  getReferralCode,
  getReferrals,
  sendInvite,
  trackReferralSignup
};
