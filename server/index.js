const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { pool } = require('./src/config/db');
const { initDb } = require('./src/config/initDb');
const authRoutes = require('./src/routes/authRoutes');
const portfolioRoutes = require('./src/routes/portfolioRoutes');
const integrationRoutes = require('./src/routes/integrationRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const templateRoutes = require('./src/routes/templateRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');

const app = express();
const port = process.env.PORT || 3001;

// Init DB
initDb();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow client
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date() });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
