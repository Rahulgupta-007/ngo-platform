import { ethers } from 'ethers';
// 1. Import YOUR existing JSON file (ABI)
import DonationTrackerArtifact from './DonationTracker.json'; 

// 2. PASTE THE ADDRESS FROM YOUR TERMINAL HERE
// (Look at the terminal where you ran "npx hardhat run scripts/deploy.js")
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

export const getContract = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // 3. Use the ABI from your JSON file
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      DonationTrackerArtifact.abi, // Accessing the 'abi' property
      signer
    );

    return contract;
  } catch (error) {
    console.error("Blockchain Connection Error:", error);
    return null;
  }
};