const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // <--- Import
require('dotenv').config();
const sequelize = require('./config/db');

const app = express();
// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000', // Local Dev
  process.env.FRONTEND_URL // Production URL (We will set this later)
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// --- MIDDLEWARE ---
app.use(cors());
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

// --- SERVER START ---
const PORT = process.env.PORT || 5000;

// CORRECTED LINE: proper function call with empty parentheses ()
// This stops the database from deleting itself on restart.
sequelize.sync({ force: false }).then(() => {
  console.log("✅ Database Synced");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log("Error syncing DB:", err));