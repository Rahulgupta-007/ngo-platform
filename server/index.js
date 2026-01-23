require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); 
const { Pool } = require('pg'); // Required for the Magic Setup
const sequelize = require('./config/db');

const app = express();

// --- MIDDLEWARE ---
app.use(helmet()); // Adds security headers

// CORS Configuration (Updated for Vercel)
app.use(cors({
  origin: [
    "http://localhost:3000",                // Trust your laptop
    process.env.FRONTEND_URL                // Trust the Vercel URL
  ],
  credentials: true
}));

app.use(express.json());

// --- ROUTES ---
app.use('/auth', require('./routes/authRoutes'));
app.use('/campaigns', require('./routes/campaignRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/volunteer-posts', require('./routes/volunteerRoutes'));
app.use('/public', require('./routes/publicRoutes'));
app.use('/donations', require('./routes/donationRoutes'));

// --- TEST ROUTE ---
app.get('/', (req, res) => {
  res.send('NGO Nexus API is Running...');
});

// --- MAGIC DATABASE SETUP ROUTE ---
// Visit this link ONE TIME to create your tables: 
// https://your-backend.onrender.com/setup-db
app.get('/setup-db', async (req, res) => {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // Required for Render
    });

    console.log("⏳ Creating tables...");

    // 1. Create Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'donor',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Create Donations Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS donations (
        id SERIAL PRIMARY KEY,
        campaign_id VARCHAR(255) NOT NULL,
        amount VARCHAR(255) NOT NULL,
        payment_method VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    res.send("<h1>✅ Success! Database Tables Created. You can now Register.</h1>");
  } catch (error) {
    console.error(error);
    res.status(500).send("<h1>❌ Error: " + error.message + "</h1>");
  }
});
// ----------------------------------

// --- SERVER START ---
const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false }).then(() => {
  console.log("✅ Database Synced");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log("Error syncing DB:", err));