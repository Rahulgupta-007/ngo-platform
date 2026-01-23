const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Campaign = sequelize.define('Campaign', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  targetAmount: { type: DataTypes.FLOAT, allowNull: false },
  raisedAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
  category: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false }, // <--- NEW FIELD
  deadline: { type: DataTypes.DATE, allowNull: true },
  status: { type: DataTypes.STRING, defaultValue: 'active' },
  creatorId: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Campaign;