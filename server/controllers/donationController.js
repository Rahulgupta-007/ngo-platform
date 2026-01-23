const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');

exports.createDonation = async (req, res) => {
  try {
    const { campaignId, amount, paymentMethod } = req.body;
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: "Invalid donation amount" });
    }

    // 1. Check if campaign exists
    const campaign = await Campaign.findByPk(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    if (campaign.status !== 'active') {
      return res.status(400).json({ message: "This campaign is no longer accepting donations." });
    }

    // 2. Record the Donation
    const newDonation = await Donation.create({
      amount: numericAmount,
      donorId: req.user.id,
      donorName: req.user.name,
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      paymentMethod: paymentMethod || 'Card'
    });

    // 3. Update Campaign Total (Critical Step!)
    campaign.raisedAmount = (parseFloat(campaign.raisedAmount) || 0) + numericAmount;
    await campaign.save();

    res.status(201).json({ message: "Donation Successful!", donation: newDonation });

  } catch (err) {
    console.error("Donation Error:", err);
    res.status(500).json({ message: "Payment processing failed" });
  }
};

exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.findAll({ 
      where: { donorId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch donations" });
  }
};