const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');

// Campaign Controller
exports.createCampaign = async (req, res) => {
  try {
    const { title, description, targetAmount, deadline, category, location } = req.body;

    const newCampaign = await Campaign.create({
      title,
      description,
      targetAmount,
      deadline,
      category,
      location,
      creatorId: req.user.id,
      raisedAmount: 0,
      status: 'active' // <--- FORCE THIS LINE
    });

    res.status(201).json(newCampaign);
  } catch (err) {
    res.status(500).json({ message: "Failed to create campaign" });
  }
};

exports.getAllCampaigns = async (req, res) => {
  try {
    // Fetch ALL campaigns (remove 'where' clause if it exists to debug)
    const campaigns = await Campaign.findAll({
      order: [['createdAt', 'DESC']] 
    });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Donation Controller
exports.donateToCampaign = async (req, res) => {
  try {
    // Validate input
    const { campaignId, amount, method } = req.body;
    const userId = req.user.id;

    if (!campaignId || !amount) {
      return res.status(400).json({ message: 'Campaign ID and Amount are required' });
    }

    // Update campaign
    const campaign = await Campaign.findByPk(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    campaign.raisedAmount = (campaign.raisedAmount || 0) + amount;
    await campaign.save();

    // Save donation
    await Donation.create({
      amount,
      method: method || 'UPI',
      campaignTitle: campaign.title,
      userId
    });

    console.log(` Donation Recorded: ${amount} via ${method}`);
    res.json({ message: 'Donation Successful' });
  } catch (err) {
    console.error(' DONATION ERROR:', err);
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
};

exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']]
    });
    res.json(donations);
  } catch (err) {
    console.error(' DONATION HISTORY ERROR:', err);
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
};
// ... existing functions ...

exports.getMyCampaigns = async (req, res) => {
  try {
    // Fetch campaigns created by the logged-in NGO
    const campaigns = await Campaign.findAll({ 
      where: { creatorId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(campaigns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch my campaigns" });
  }
};