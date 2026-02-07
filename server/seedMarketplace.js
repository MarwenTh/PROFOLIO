const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const dummyItems = [
  {
    type: 'template',
    title: 'Modern Portfolio V1',
    description: 'A clean, minimalist portfolio template for developers. Features dark mode, responsive design, and SEO optimization.',
    price: 29.99,
    preview_images: JSON.stringify(['https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&q=80']),
    status: 'published',
    downloads: 125,
    rating: 4.8
  },
  {
    type: 'component',
    title: 'Animated Button Pack',
    description: 'A collection of 20+ animated buttons for React. Includes hover effects, loading states, and more.',
    price: 9.99,
    preview_images: JSON.stringify(['https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80']),
    status: 'published',
    downloads: 450,
    rating: 4.9
  },
  {
    type: 'theme',
    title: 'Cyberpunk Dashboard',
    description: 'A futuristic dashboard theme with neon accents and glassmorphism effects. Perfect for gaming or crypto apps.',
    price: 49.00,
    preview_images: JSON.stringify(['https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80']),
    status: 'published',
    downloads: 89,
    rating: 4.7
  },
  {
    type: 'template',
    title: 'SaaS Landing Page',
    description: 'High-converting landing page template for SaaS products. Includes pricing tables, feature grids, and testimonials.',
    price: 39.00,
    preview_images: JSON.stringify(['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80']),
    status: 'published',
    downloads: 210,
    rating: 4.6
  },
  {
    type: 'component',
    title: 'Interactive Charts Library',
    description: 'Beautiful, responsive charts for data visualization. Easy to integrate with any React project.',
    price: 0,
    preview_images: JSON.stringify(['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80']),
    status: 'published',
    downloads: 1200,
    rating: 4.5
  },
  {
      type: 'template',
      title: 'Minimal Blog',
      description: 'Focus on content with this ultra-clean blog template. Fast loading and reader-friendly.',
      price: 19.00,
      preview_images: JSON.stringify(['https://images.unsplash.com/photo-1499750310159-5254f4197264?auto=format&fit=crop&q=80']),
      status: 'published',
      downloads: 75,
      rating: 4.4
  },
  {
      type: 'component',
      title: '3D Card Effect',
      description: 'Stunning 3D tilt effects for your cards. Adds depth and interactivity to your UI.',
      price: 5.00,
      preview_images: JSON.stringify(['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80']),
      status: 'published',
      downloads: 320,
      rating: 4.9
  },
   {
      type: 'theme',
      title: 'Dark Academia',
      description: 'A scholarly, moody theme with serif fonts and rich textures. Ideal for portfolios and blogs.',
      price: 25.00,
      preview_images: JSON.stringify(['https://images.unsplash.com/photo-1507842217121-7563175208d9?auto=format&fit=crop&q=80']),
      status: 'published',
      downloads: 42,
      rating: 4.8
  }
];

const seedMarketplace = async () => {
  try {
    // 1. Get a user to assign items to (first user found)
    const userRes = await pool.query('SELECT id FROM users LIMIT 1');
    if (userRes.rows.length === 0) {
      console.error('No users found. Please create a user first.');
      return;
    }
    const userId = userRes.rows[0].id;
    console.log(`Seeding data for User ID: ${userId}`);

    // 2. Insert Items
    for (const item of dummyItems) {
      const query = `
        INSERT INTO marketplace_items (seller_id, type, title, description, price, preview_images, status, downloads, rating)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
      `;
      const values = [
        userId,
        item.type,
        item.title,
        item.description,
        item.price,
        item.preview_images,
        item.status,
        item.downloads,
        item.rating
      ];
      
      const res = await pool.query(query, values);
      const itemId = res.rows[0].id;
      console.log(`Inserted item: ${item.title} (ID: ${itemId})`);

      // 3. Insert Dummy Purchases for this item (to make analytics look real)
      if (item.downloads > 0 && item.price > 0) {
          // Create a few sales
          const numSales = Math.min(5, Math.floor(item.downloads / 10)) + 1; // Just a few mock sales records
          for(let i=0; i<numSales; i++) {
               // We need a buyer. Let's try to find another user, or just use the same user for simplicity (self-purchase allowed in logic?)
               // Ideally we should use a different user, but for seeding stats, we might need to fake the buyer_id if we don't have many users.
               // Let's just use the same user for now, or fetch another if exists.
               const buyerRes = await pool.query('SELECT id FROM users WHERE id != $1 LIMIT 1', [userId]);
               let buyerId = userId;
               if (buyerRes.rows.length > 0) buyerId = buyerRes.rows[0].id;

               // Avoid unique constraint violation if buyer buys same item multiple times?
               // The schema says UNIQUE(buyer_id, item_id). So a buyer can only buy an item once.
               // So we can only insert ONE purchase per buyer per item.
               // If we only have 1 user, we can only insert 1 purchase record.
               
               try {
                 await pool.query(`
                    INSERT INTO marketplace_purchases (buyer_id, item_id, amount, payment_status)
                    VALUES ($1, $2, $3, 'completed')
                    ON CONFLICT DO NOTHING
                 `, [buyerId, itemId, item.price]);
               } catch (e) {
                   // ignore uniqueness errors
               }
          }
      }
    }

    console.log('✅ Marketplace seeding complete!');
  } catch (err) {
    console.error('Error seeding marketplace:', err);
  } finally {
    pool.end();
  }
};

seedMarketplace();
