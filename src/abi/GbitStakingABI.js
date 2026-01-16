// src/abi/GbitStakingABI.js
export const GbitStakingABI = [
  // 🔍 Views (leitura)
  "function totalStaked() external view returns (uint256)",
  "function apy() external view returns (uint256)",
  "function userStaked(address user) external view returns (uint256)",
  "function getUserStake(address user) external view returns (uint256)",
  "function getAPY() external view returns (uint256)",
  "function getContractBalance() external view returns (uint256)",

  // 💰 Stake/Unstake
  "function stake(uint256 amount) external",
  "function unstake(uint256 amount) external",

  // 📊 Events
  "event Staked(address indexed user, uint256 amount)",
  "event Unstaked(address indexed user, uint256 amount, uint256 reward)"
];
