require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // <--- This loads your .env file

module.exports = {
  solidity: "0.8.24", // Make sure this version matches your contract's "pragma"
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL,      // Reads from .env
      accounts: [process.env.PRIVATE_KEY] // Reads from .env
    }
  }
};