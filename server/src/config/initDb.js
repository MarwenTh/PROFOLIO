const { pool } = require('./db');

const initDb = async () => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      is_verified BOOLEAN DEFAULT FALSE,
      image TEXT,
      email_verified TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // NextAuth expects these tables for full functionality (OAuth etc)
  // But for simple credentials, users table is enough for now.
  // Adding them just in case.
  const createAccountsTable = `
    CREATE TABLE IF NOT EXISTS accounts (
      id SERIAL PRIMARY KEY,
      "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type VARCHAR(255) NOT NULL,
      provider VARCHAR(255) NOT NULL,
      "providerAccountId" VARCHAR(255) NOT NULL,
      refresh_token TEXT,
      access_token TEXT,
      expires_at BIGINT,
      token_type VARCHAR(255),
      scope VARCHAR(255),
      id_token TEXT,
      session_state TEXT,
      UNIQUE(provider, "providerAccountId")
    );
  `;

  const createSessionsTable = `
    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY,
      "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires TIMESTAMP WITH TIME ZONE NOT NULL,
      "sessionToken" VARCHAR(255) NOT NULL UNIQUE
    );
  `;

  const createVerificationTokenTable = `
    CREATE TABLE IF NOT EXISTS verification_token (
      identifier VARCHAR(255) NOT NULL,
      token VARCHAR(255) NOT NULL,
      expires TIMESTAMP WITH TIME ZONE NOT NULL,
      PRIMARY KEY (identifier, token)
    );
  `;

  const createPortfoliosTable = `
    CREATE TABLE IF NOT EXISTS portfolios (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      status VARCHAR(50) DEFAULT 'draft',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const addDescriptionColumn = `
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolios' AND column_name='description') THEN
        ALTER TABLE portfolios ADD COLUMN description TEXT;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolios' AND column_name='content') THEN
        ALTER TABLE portfolios ADD COLUMN content JSONB DEFAULT '[]';
      END IF;
    END $$;
  `;

  try {
    await pool.query(createUsersTable);
    console.log('✅ Users table initialized');
    await pool.query(createAccountsTable);
    await pool.query(createSessionsTable);
    await pool.query(createVerificationTokenTable);
    await pool.query(createPortfoliosTable);
    await pool.query(addDescriptionColumn);
    console.log('✅ Portfolios and NextAuth tables initialized');
  } catch (err) {
    console.error('❌ Error initializing database:', err);
  }
};

module.exports = { initDb };
