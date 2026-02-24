const { pool } = require("./db");

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

  const createMarketplaceItemsTable = `
    CREATE TABLE IF NOT EXISTS marketplace_items (
      id SERIAL PRIMARY KEY,
      seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE SET NULL,
      type VARCHAR(50) NOT NULL CHECK (type IN ('template', 'component', 'theme', 'portfolio', 'animation')),
      title VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      preview_images JSONB DEFAULT '[]',
      content JSONB,
      status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'suspended')),
      downloads INTEGER DEFAULT 0,
      rating DECIMAL(3,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createMarketplacePurchasesTable = `
    CREATE TABLE IF NOT EXISTS marketplace_purchases (
      id SERIAL PRIMARY KEY,
      buyer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      item_id INTEGER REFERENCES marketplace_items(id) ON DELETE CASCADE,
      amount DECIMAL(10,2) NOT NULL,
      payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
      purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(buyer_id, item_id)
    );
  `;

  const createMarketplaceSavesTable = `
    CREATE TABLE IF NOT EXISTS marketplace_saves (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      item_id INTEGER REFERENCES marketplace_items(id) ON DELETE CASCADE,
      saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, item_id)
    );
  `;

  const createSubscribersTable = `
    CREATE TABLE IF NOT EXISTS subscribers (
      id SERIAL PRIMARY KEY,
      portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
      email VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
      subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      unsubscribed_at TIMESTAMP,
      UNIQUE(portfolio_id, email)
    );
  `;

  const createNewslettersTable = `
    CREATE TABLE IF NOT EXISTS newsletters (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
      subject VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      sent_to INTEGER DEFAULT 0,
      opened INTEGER DEFAULT 0,
      clicked INTEGER DEFAULT 0,
      status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'scheduled')),
      sent_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createReferralsTable = `
    CREATE TABLE IF NOT EXISTS referrals (
      id SERIAL PRIMARY KEY,
      referrer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      referred_email VARCHAR(255),
      referred_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rewarded')),
      reward_amount DECIMAL(10,2) DEFAULT 0,
      referral_code VARCHAR(100) UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP
    );
  `;

  const createCodeSnippetsTable = `
    CREATE TABLE IF NOT EXISTS code_snippets (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE SET NULL,
      title VARCHAR(255),
      language VARCHAR(50) NOT NULL,
      code TEXT NOT NULL,
      is_public BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createCollectionsTable = `
    CREATE TABLE IF NOT EXISTS collections (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      preview_image TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createCollectionItemsTable = `
    CREATE TABLE IF NOT EXISTS collection_items (
      collection_id INTEGER REFERENCES collections(id) ON DELETE CASCADE,
      media_id INTEGER REFERENCES media_library(id) ON DELETE CASCADE,
      added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (collection_id, media_id)
    );
  `;

  const createSandboxComponentsTable = `
    CREATE TABLE IF NOT EXISTS sandbox_components (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL DEFAULT 'Untitled',
      slug TEXT,
      description TEXT,
      category TEXT DEFAULT 'general',
      status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
      visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('public', 'private')),
      files JSONB NOT NULL DEFAULT '{}',
      views INTEGER DEFAULT 0,
      code_copies INTEGER DEFAULT 0,
      likes INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createUsersTable);
    console.log("✅ Users table initialized");
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
    // Add columns to media_library if they don't exist (for migration)
    const addMediaColumns = `
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media_library' AND column_name='width') THEN
          ALTER TABLE media_library ADD COLUMN width INTEGER;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media_library' AND column_name='height') THEN
          ALTER TABLE media_library ADD COLUMN height INTEGER;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media_library' AND column_name='blur_hash') THEN
          ALTER TABLE media_library ADD COLUMN blur_hash TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media_library' AND column_name='unsplash_id') THEN
          ALTER TABLE media_library ADD COLUMN unsplash_id VARCHAR(255);
        END IF;
      END $$;
    `;
    await pool.query(addMediaColumns);

    await pool.query(createCollectionsTable);
    await pool.query(createCollectionItemsTable);

    const createSearchHistoryTable = `
      CREATE TABLE IF NOT EXISTS search_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        query VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createSearchHistoryTable);

    await pool.query(createPortfolioSeoTable);
    await pool.query(createPortfolioDomainsTable);
    await pool.query(createMarketplaceItemsTable);

    // Update existing constraint to allow new types
    const updateMarketplaceItemsTypeConstraint = `
      DO $$ 
      BEGIN 
        ALTER TABLE marketplace_items DROP CONSTRAINT IF EXISTS marketplace_items_type_check;
        ALTER TABLE marketplace_items ADD CONSTRAINT marketplace_items_type_check CHECK (type IN ('template', 'component', 'theme', 'portfolio', 'animation'));
      EXCEPTION
        WHEN undefined_object THEN null;
      END $$;
    `;
    await pool.query(updateMarketplaceItemsTypeConstraint);

    await pool.query(createMarketplacePurchasesTable);
    await pool.query(createMarketplaceSavesTable);
    await pool.query(createSubscribersTable);
    await pool.query(createNewslettersTable);
    await pool.query(createReferralsTable);
    await pool.query(createCodeSnippetsTable);

    const createRecentlyUsedTable = `
      CREATE TABLE IF NOT EXISTS recently_used (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL, -- 'background', 'icon', 'upload'
        content JSONB NOT NULL,
        used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, type, content)
      );
    `;
    await pool.query(createRecentlyUsedTable);
    await pool.query(createSandboxComponentsTable);
    console.log("✅ Sandbox components table initialized");

    console.log(
      "✅ All database tables initialized successfully (including marketplace, subscribers, referrals, code editor, recently used & sandbox)",
    );
  } catch (err) {
    console.error("❌ Error initializing database:", err);
  }
};

module.exports = { initDb };
