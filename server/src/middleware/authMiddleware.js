const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Priority 1: Access Token from Cookies
    // Priority 2: Access Token from Authorization Header
    const accessToken = req.cookies.accessToken || (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

    if (!accessToken) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET || 'your_fallback_secret');
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
    }
};

module.exports = authMiddleware;
