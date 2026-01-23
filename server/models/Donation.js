const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Donation = sequelize.define('Donation', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  donorId: { type: DataTypes.INTEGER, allowNull: false },
  donorName: { type: DataTypes.STRING, allowNull: false },
  campaignId: { type: DataTypes.UUID, allowNull: false }, // Links to Campaign
  campaignTitle: { type: DataTypes.STRING, allowNull: false },
  paymentMethod: { type: DataTypes.STRING, defaultValue: 'Card' },
  status: { type: DataTypes.STRING, defaultValue: 'completed' }
});

module.exports = Donation;