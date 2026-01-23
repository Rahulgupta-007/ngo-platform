// smart-contracts/scripts/deploy.js
const hre = require("hardhat");

async function main() {
  // 1. Get the contract factory
  const DonationTracker = await hre.ethers.getContractFactory("DonationTracker");

  // 2. Deploy it
  const tracker = await DonationTracker.deploy();

  // 3. Wait for it to finish
  await tracker.waitForDeployment();

  console.log("✅ DonationTracker deployed to:", await tracker.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});