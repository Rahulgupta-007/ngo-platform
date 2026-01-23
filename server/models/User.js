const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'donor' }, // admin, ngo, donor, volunteer
  
  // --- NGO SPECIFIC ---
  govId: { type: DataTypes.STRING },
  organizationType: { type: DataTypes.STRING }, // <--- NEW
  location: { type: DataTypes.STRING },         // <--- NEW
  description: { type: DataTypes.TEXT },        // <--- NEW
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: true },

  // --- VOLUNTEER SPECIFIC ---
  age: { type: DataTypes.INTEGER },
  state: { type: DataTypes.STRING },
  availability: { type: DataTypes.STRING },     // <--- NEW
  skills: { type: DataTypes.STRING },           // Stored as string, e.g., "Medical, Teaching"
  phone: { type: DataTypes.STRING }
});

module.exports = User;