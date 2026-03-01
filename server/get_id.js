const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: !process.env.DATABASE_URL,
});

async function test() {
  try {
    const res = await pool.query("SELECT id FROM sandbox_components LIMIT 1");
    console.log("Valid ID:", res.rows[0]?.id);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

test();
