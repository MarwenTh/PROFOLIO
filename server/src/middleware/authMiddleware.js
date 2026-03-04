const { createClerkClient } = require("@clerk/backend");
const { pool } = require("../config/db");

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

const authMiddleware = async (req, res, next) => {
  console.log(`[AuthMiddleware] Hit: ${req.method} ${req.originalUrl}`);
  try {
    // Clerk v3 authenticateRequest requires an absolute URL
    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const host = req.headers["x-forwarded-host"] || req.get("host");

    if (!host) {
      console.error("[AuthMiddleware] Error: Missing host header");
      return res
        .status(400)
        .json({ success: false, message: "Missing host header" });
    }

    const fullUrl = `${protocol}://${host}${req.originalUrl}`;

    const request = new Request(fullUrl, {
      method: req.method,
      headers: new Headers(req.headers),
    });

    const requestState = await clerk.authenticateRequest(request);

    if (!requestState.isSignedIn) {
      console.log(`[AuthMiddleware] Unauthorized: No session for ${fullUrl}`);
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or expired session",
      });
    }

    const { userId: clerkId } = requestState.toAuth();
    console.log(`[AuthMiddleware] Authenticated Clerk User: ${clerkId}`);

    // Look up user by clerk_id
    const result = await pool.query(
      "SELECT id, email, name FROM users WHERE clerk_id = $1",
      [clerkId],
    );

    if (result.rows.length === 0) {
      console.log(`[AuthMiddleware] Unauthorized: User ${clerkId} not synced`);
      return res
        .status(401)
        .json({ success: false, message: "User not synced with database" });
    }

    req.user = result.rows[0];
    req.user.clerkId = clerkId;
    next();
  } catch (err) {
    console.error("Clerk auth error:", err);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Error verifying authentication",
    });
  }
};

module.exports = authMiddleware;
