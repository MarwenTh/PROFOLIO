const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

const setTokenCookies = (res, user) => {
    const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Lax is good for local dev with different ports
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days matching refresh token
    };

    res.cookie('accessToken', accessToken, { 
        ...cookieOptions, 
        maxAge: 15 * 60 * 1000 // 15 mins for access token
    });
    
    res.cookie('refreshToken', refreshToken, cookieOptions);

    return { accessToken, refreshToken };
};

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (name, email, password, is_verified) VALUES ($1, $2, $3, $4) RETURNING id, name, email, is_verified',
      [name || email.split('@')[0], email, hashedPassword, false]
    );

    const user = result.rows[0];
    setTokenCookies(res, user);

    res.status(201).json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error during signup' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    setTokenCookies(res, user);

    res.json({
      success: true,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        isVerified: user.is_verified
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

const getProfile = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, profession, bio, website, twitter, github, linkedin, location, image, is_verified FROM users WHERE id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateProfile = async (req, res) => {
    const { name, profession, bio, website, twitter, github, linkedin, location } = req.body;

    try {
        const result = await pool.query(
            `UPDATE users 
             SET name = COALESCE($1, name),
                 profession = COALESCE($2, profession),
                 bio = COALESCE($3, bio),
                 website = COALESCE($4, website),
                 twitter = COALESCE($5, twitter),
                 github = COALESCE($6, github),
                 linkedin = COALESCE($7, linkedin),
                 location = COALESCE($8, location)
             WHERE id = $9 RETURNING id, name, email, profession, bio, website, twitter, github, linkedin, location`,
            [name, profession, bio, website, twitter, github, linkedin, location, req.user.id]
        );

        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const socialSync = async (req, res) => {
    const { email, name, image } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    try {
        let result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        let user;

        if (result.rows.length === 0) {
            const newUser = await pool.query(
                'INSERT INTO users (name, email, image, password, is_verified) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, is_verified',
                [name || email.split('@')[0], email, image, 'social_login_no_password', true]
            );
            user = newUser.rows[0];
        } else {
            user = result.rows[0];
            await pool.query(
                'UPDATE users SET name = COALESCE($1, name), image = COALESCE($2, image) WHERE id = $3',
                [name, image, user.id]
            );
        }

        setTokenCookies(res, user);

        res.json({
            success: true,
            user: {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                isVerified: user.is_verified
            }
        });
    } catch (err) {
        console.error('Error in socialSync:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const refreshToken = async (req, res) => {
    const refresh_token = req.cookies.refreshToken;

    if (!refresh_token) {
        return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    try {
        const decoded = jwt.verify(refresh_token, JWT_SECRET);
        
        // Fetch user to ensure they still exist
        const result = await pool.query('SELECT id, email, name, is_verified FROM users WHERE id = $1', [decoded.id]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ success: false, message: 'User no longer exists' });
        }

        setTokenCookies(res, user);

        res.json({ success: true, message: 'Token refreshed successfully' });
    } catch (err) {
        console.error('Refresh token error:', err);
        return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }
};

const logout = (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = { signup, login, getProfile, updateProfile, socialSync, refreshToken, logout };
