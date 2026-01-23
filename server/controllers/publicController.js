const User = require('../models/User');
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');

exports.getLandingStats = async (req, res) => {
  try {
    // 1. Count Verified NGOs
    const ngoCount = await User.count({ where: { role: 'ngo', isVerified: true } });
    
    // 2. Count Total Donors
    const donorCount = await User.count({ where: { role: 'donor' } });
    
    // 3. Sum Total Donations (Money Raised)
    const totalRaised = await Donation.sum('amount') || 0;

    // 4. Count Active Campaigns (Lives Impacted - distinct count or just total campaigns)
    const impactCount = await Campaign.count();

    res.json({
      ngos: ngoCount,
      donors: donorCount,
      raised: totalRaised,
      impact: impactCount
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching public stats" });
  }
};