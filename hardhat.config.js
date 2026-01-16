import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

export default {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      accounts: {
        count: 10,
        accountsBalance: "10000000000000000000000"
      }
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,       // pega do .env
      accounts: [process.env.PRIVATE_KEY]     // pega do .env
    }
  }
};
