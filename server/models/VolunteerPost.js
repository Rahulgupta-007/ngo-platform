const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const VolunteerPost = sequelize.define('VolunteerPost', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  skillsRequired: { type: DataTypes.JSON }, // Store as ["Teaching", "Medical"]
  location: { type: DataTypes.STRING, allowNull: false },
  ngoId: { type: DataTypes.INTEGER, allowNull: false }, // Links to the NGO
  ngoName: { type: DataTypes.STRING }, // Store name for easy display
  applicants: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: 'open' } // open, closed
});

module.exports = VolunteerPost;