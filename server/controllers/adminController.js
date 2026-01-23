const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const { Op } = require('sequelize');

// Dashboard Controller
exports.getDashboardStats = async (req, res) => {
  try {
    console.log("🔍 Fetching Admin Stats...");

    // 1. Debug: Print ALL users to terminal to see what we have
    const allUsers = await User.findAll({ attributes: ['id', 'name', 'role', 'isVerified'] });
    console.log("👥 ALL USERS IN DB:", JSON.stringify(allUsers, null, 2));

    // 2. Count Stats
    const totalUsers = await User.count();
    const ngoCount = await User.count({ where: { role: 'ngo' } });
    const volunteerCount = await User.count({ where: { role: 'volunteer' } });
    const donorCount = await User.count({ where: { role: 'donor' } });

    // 3. Financials
    const totalDonations = await Donation.sum('amount') || 0;
    
    // 4. Pending NGOs Query
    // We explicitly look for role='ngo' AND isVerified=false (or 0)
    const pendingNGOs = await User.findAll({ 
      where: { 
        role: 'ngo', 
        isVerified: false 
      } 
    });
    
    console.log(`⚠️ Found ${pendingNGOs.length} pending NGOs`);

    res.json({
      counts: { total: totalUsers, ngos: ngoCount, volunteers: volunteerCount, donors: donorCount },
      finance: { totalRaised: totalDonations, recent: [] },
      pendingNGOs
    });

  } catch (err) {
    console.error("❌ ADMIN STATS ERROR:", err);
    res.status(500).json({ message: "Stats Failed" });
  }
};
// Admin Controller
exports.stopCampaign = async (req, res) => {
  try {
    const { id } = req.body;
    const campaign = await Campaign.findByPk(id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.status === 'stopped') {
      return res.status(400).json({ message: 'Campaign is already stopped' });
    }

    await campaign.update({ status: 'stopped' });
    res.json({ message: 'Campaign stopped' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error stopping campaign' });
  }
};

exports.verifyNGO = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findByPk(id);
    if (!user || user.role !== 'ngo') {
      return res.status(404).json({ message: 'NGO not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'NGO is already verified' });
    }

    await user.update({ isVerified: true });
    res.json({ message: 'NGO verified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error verifying NGO' });
  }
};
// ... existing code ...

// Admin Action: Reject NGO (Delete user or mark rejected)
exports.rejectNGO = async (req, res) => {
  try {
    const { id } = req.body;
    // Option A: Delete them
    await User.destroy({ where: { id } });
    
    // Option B: Mark as rejected (Better for records)
    // await User.update({ isVerified: false, role: 'rejected' }, { where: { id } });

    res.json({ message: "NGO Rejected" });
  } catch (err) {
    res.status(500).json({ message: "Action Failed" });
  }
};