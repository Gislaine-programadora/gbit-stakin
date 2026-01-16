import dotenv from 'dotenv';
dotenv.config();

export default {
  PRIVATE_KEY: process.env.PRIVATE_KEY || '',
  RPC_URL: process.env.SEPOLIA_RPC_URL || 'https://ethereum-sepolia.publicnode.com',  // ← SEPOLIA_RPC_URL!
  STAKING_CONTRACT: process.env.STAKING_CONTRACT || '0x19861B8C9BF3cB96865dAeD37058d661954BF6C6',

  WALLET_ADDRESS: process.env.WALLET_ADDRESS || '0x297e1984BF7Da594a34E88Ecadf7B47bBbb3A5c2',
  GBIT_TOKEN_ADDRESS: process.env.GBIT_TOKEN_ADDRESS || '0x64fc44cAFC219245A212A4a9ae8E6B240D080970',
};

