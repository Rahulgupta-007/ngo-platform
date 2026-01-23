const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Application = sequelize.define('Application', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  volunteerId: { type: DataTypes.INTEGER, allowNull: false },
  volunteerName: { type: DataTypes.STRING, allowNull: false }, // Store name for easy display
  postId: { type: DataTypes.UUID, allowNull: false },
  postTitle: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' }, // pending, accepted, rejected
  appliedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Application;