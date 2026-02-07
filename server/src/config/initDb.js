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
      profession VARCHAR(255),
      bio TEXT,
      website VARCHAR(255),
      twitter VARCHAR(255),
      github VARCHAR(255),
      linkedin VARCHAR(255),
      location VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const addNewUserColumns = `
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='profession') THEN
        ALTER TABLE users ADD COLUMN profession VARCHAR(255);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='bio') THEN
        ALTER TABLE users ADD COLUMN bio TEXT;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='website') THEN
        ALTER TABLE users ADD COLUMN website VARCHAR(255);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='twitter') THEN
        ALTER TABLE users ADD COLUMN twitter VARCHAR(255);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='github') THEN
        ALTER TABLE users ADD COLUMN github VARCHAR(255);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='linkedin') THEN
        ALTER TABLE users ADD COLUMN linkedin VARCHAR(255);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='location') THEN
        ALTER TABLE users ADD COLUMN location VARCHAR(255);
      END IF;
    END $$;
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

  const createIntegrationsTable = `
    CREATE TABLE IF NOT EXISTS user_integrations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      service_name VARCHAR(100) NOT NULL,
      api_key TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'connected',
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, service_name)
    );
  `;

  const createProjectsTable = `
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      image_url TEXT,
      project_url TEXT,
      github_url TEXT,
      tags JSONB DEFAULT '[]',
      featured BOOLEAN DEFAULT FALSE,
      order_index INTEGER DEFAULT 0,
      status VARCHAR(50) DEFAULT 'published',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createTemplatesTable = `
    CREATE TABLE IF NOT EXISTS templates (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      preview_image TEXT,
      thumbnail_image TEXT,
      structure JSONB NOT NULL,
      is_premium BOOLEAN DEFAULT FALSE,
      price DECIMAL(10,2) DEFAULT 0,
      downloads INTEGER DEFAULT 0,
      rating DECIMAL(3,2) DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createUserTemplatesTable = `
    CREATE TABLE IF NOT EXISTS user_templates (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      template_id INTEGER NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
      purchased_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, template_id)
    );
  `;

  const createPortfolioViewsTable = `
    CREATE TABLE IF NOT EXISTS portfolio_views (
      id SERIAL PRIMARY KEY,
      portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
      visitor_ip VARCHAR(45),
      user_agent TEXT,
      referrer TEXT,
      country VARCHAR(100),
      city VARCHAR(100),
      viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createPortfolioStatsTable = `
    CREATE TABLE IF NOT EXISTS portfolio_stats (
      id SERIAL PRIMARY KEY,
      portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      total_views INTEGER DEFAULT 0,
      unique_visitors INTEGER DEFAULT 0,
      avg_time_on_page INTEGER DEFAULT 0,
      bounce_rate DECIMAL(5,2) DEFAULT 0,
      UNIQUE(portfolio_id, date)
    );
  `;

  const createMediaLibraryTable = `
    CREATE TABLE IF NOT EXISTS media_library (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      filename VARCHAR(255) NOT NULL,
      original_name VARCHAR(255),
      file_type VARCHAR(100),
      file_size INTEGER,
      url TEXT NOT NULL,
      folder VARCHAR(255) DEFAULT 'root',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createPortfolioSeoTable = `
    CREATE TABLE IF NOT EXISTS portfolio_seo (
      id SERIAL PRIMARY KEY,
      portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
      meta_title VARCHAR(255),
      meta_description TEXT,
      meta_keywords TEXT,
      og_image TEXT,
      og_title VARCHAR(255),
      og_description TEXT,
      twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
      canonical_url TEXT,
      robots VARCHAR(100) DEFAULT 'index, follow',
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(portfolio_id)
    );
  `;

  const createPortfolioDomainsTable = `
    CREATE TABLE IF NOT EXISTS portfolio_domains (
      id SERIAL PRIMARY KEY,
      portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
      domain VARCHAR(255) NOT NULL UNIQUE,
      is_primary BOOLEAN DEFAULT FALSE,
      is_verified BOOLEAN DEFAULT FALSE,
      verification_code VARCHAR(100),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      verified_at TIMESTAMP WITH TIME ZONE
    );
  `;

  try {
    await pool.query(createUsersTable);
    console.log('✅ Users table initialized');
    await pool.query(addNewUserColumns);
    await pool.query(createAccountsTable);
    await pool.query(createSessionsTable);
    await pool.query(createVerificationTokenTable);
    await pool.query(createPortfoliosTable);
    await pool.query(addDescriptionColumn);
    await pool.query(createIntegrationsTable);
    await pool.query(createProjectsTable);
    await pool.query(createTemplatesTable);
    await pool.query(createUserTemplatesTable);
    await pool.query(createPortfolioViewsTable);
    await pool.query(createPortfolioStatsTable);
    await pool.query(createMediaLibraryTable);
    await pool.query(createPortfolioSeoTable);
    await pool.query(createPortfolioDomainsTable);
    console.log('✅ All database tables initialized successfully');
  } catch (err) {
    console.error('❌ Error initializing database:', err);
  }
};

module.exports = { initDb };
