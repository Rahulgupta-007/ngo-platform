// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DonationTracker {
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
        string campaignId; 
    }

    mapping(string => Donation[]) public campaignDonations;
    mapping(string => uint256) public campaignTotals;

    event DonationReceived(string campaignId, address donor, uint256 amount);

    function donate(string memory _campaignId) public payable {
        require(msg.value > 0, "Donation must be greater than 0");

        Donation memory newDonation = Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            campaignId: _campaignId
        });

        campaignDonations[_campaignId].push(newDonation);
        campaignTotals[_campaignId] += msg.value;

        emit DonationReceived(_campaignId, msg.sender, msg.value);
    }

    function getDonations(string memory _campaignId) public view returns (Donation[] memory) {
        return campaignDonations[_campaignId];
    }

    function getCampaignTotal(string memory _campaignId) public view returns (uint256) {
        return campaignTotals[_campaignId];
    }
}