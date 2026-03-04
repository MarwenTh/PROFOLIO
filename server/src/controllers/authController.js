const { pool } = require("../config/db");
const { Webhook } = require("svix");

const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, profession, bio, website, twitter, github, linkedin, location, image, is_verified FROM users WHERE id = $1",
      [req.user.id],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  const {
    name,
    profession,
    bio,
    website,
    twitter,
    github,
    linkedin,
    location,
    image,
  } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users 
       SET name = $1, profession = $2, bio = $3, website = $4, twitter = $5, github = $6, linkedin = $7, location = $8, image = $9
       WHERE id = $10 
       RETURNING *`,
      [
        name,
        profession,
        bio,
        website,
        twitter,
        github,
        linkedin,
        location,
        image,
        req.user.id,
      ],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const syncUser = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET in .env");
    return res.status(500).json({ error: "Server configuration error" });
  }

  // Get the headers and body
  const headers = req.headers;
  const payload = JSON.stringify(req.body);

  // Get the Svix headers for verification
  const svix_id = headers["svix-id"];
  const svix_timestamp = headers["svix-timestamp"];
  const svix_signature = headers["svix-signature"];

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: "Missing svix headers" });
  }

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Attempt to verify the incoming webhook
  // If successful, the helper will return the parsed body
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err.message);
    return res.status(400).json({ error: "Invalid signature" });
  }

  const { type, data } = evt;
  const { id, first_name, last_name, email_addresses, image_url } = data;

  try {
    // 1. Handle User Deletion
    if (type === "user.deleted") {
      await pool.query("DELETE FROM users WHERE clerk_id = $1", [id]);
      return res.json({ success: true, action: "deleted", clerk_id: id });
    }

    // 2. Prepare user data for Sync/Upsert
    const email = email_addresses ? email_addresses[0]?.email_address : null;
    const name = `${first_name || ""} ${last_name || ""}`.trim();

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Missing clerk_id" });
    }

    // 3. Check if user already exists by clerk_id
    const existingById = await pool.query(
      "SELECT id FROM users WHERE clerk_id = $1",
      [id],
    );

    if (existingById.rows.length > 0) {
      // Update existing user with latest Clerk data
      const result = await pool.query(
        "UPDATE users SET name = $1, email = COALESCE($2, email), image = $3, is_verified = $4 WHERE clerk_id = $5 RETURNING id, name, email",
        [name || email?.split("@")[0], email, image_url, true, id],
      );
      return res.json({
        success: true,
        user: result.rows[0],
        action: "updated_by_clerk_id",
      });
    }

    // 4. If not found by clerk_id, check if user exists by email (to link NextAuth accounts)
    if (email) {
      const existingByEmail = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email],
      );
      if (existingByEmail.rows.length > 0) {
        // Link the account by setting clerk_id
        const result = await pool.query(
          "UPDATE users SET clerk_id = $1, name = $2, image = $3, is_verified = $4 WHERE email = $5 RETURNING id, name, email",
          [id, name || email.split("@")[0], image_url, true, email],
        );
        return res.json({
          success: true,
          user: result.rows[0],
          action: "linked_clerk_id",
        });
      }
    }

    // 5. Neither clerk_id nor email matches -> Insert new user
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email required for new users" });
    }

    const result = await pool.query(
      "INSERT INTO users (clerk_id, name, email, image, is_verified) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email",
      [id, name || email.split("@")[0], email, image_url, true],
    );

    res.json({
      success: true,
      user: result.rows[0],
      action: "inserted",
    });
  } catch (err) {
    console.error("Error syncing user:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  syncUser,
};
