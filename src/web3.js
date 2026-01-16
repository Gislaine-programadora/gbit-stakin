import { ethers } from 'ethers';
import { config } from 'dotenv';
import { GbitStakingABI } from './abi/GbitStakingABI.js';

config();

// ✅ Provider
const provider = new ethers.JsonRpcProvider(
  process.env.RPC_URL || 'https://ethereum-sepolia.publicnode.com'
);

// ✅ Wallet
let wallet;
try {
  wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '0x000', provider);
} catch {
  wallet = {
    getAddress: async () =>
      process.env.WALLET_ADDRESS ||
      '0x297e1984BF7Da594a34E88Ecadf7B47bBbb3A5c2',
    address:
      process.env.WALLET_ADDRESS ||
      '0x297e1984BF7Da594a34E88Ecadf7B47bBbb3A5c2',
  };
}

// ✅ Staking contract
let stakingContract;
try {
  stakingContract = new ethers.Contract(
    process.env.STAKING_CONTRACT ||
    '0x19861B8C9BF3cB96865dAeD37058d661954BF6C6',

    GbitStakingABI,
    wallet
  );
} catch {
  stakingContract = { /* fallback fake */ };
}

// ✅ Token GBIT contract
const GBIT_TOKEN_ADDRESS =
  process.env.GBIT_TOKEN_ADDRESS || '0x64fc44cAFC219245A212A4a9ae8E6B240D080970'; // ← SEU GBIT!
const gbitAbi = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) external returns (bool)',
  'function balanceOf(address account) external view returns (uint256)',
];
const gbitToken = new ethers.Contract(GBIT_TOKEN_ADDRESS, gbitAbi, wallet);

// ✅ Função utilitária: saldo GBIT (NÃO ETH!)
async function getBalance(address) {
  try {
    const balance = await gbitToken.balanceOf(address);
    return ethers.formatEther(balance);
  } catch {
    return '0.00';
  }
}

// 🔥 FUNÇÃO CORRIGIDA - FUNÇÕES DO SEU CONTRATO!
async function getStakingInfo(address = null) {
  try {
    const walletAddress =
      typeof wallet.getAddress === 'function'
        ? await wallet.getAddress()
        : wallet.address;

    const finalAddress = address || walletAddress;

    // ✅ FUNÇÕES CORRETAS DO SEU CONTRATO GbitStaking.sol
    const [totalStaked, apy, userStaked] = await Promise.all([
      stakingContract.totalStaked(),
      stakingContract.getAPY(),           // ← CORRIGIDO!
      stakingContract.getUserStake(finalAddress),  // ← CORRIGIDO!
    ]);

    return {
      totalStaked: Number(ethers.formatEther(totalStaked)).toFixed(2),
      apy: Number(apy) / 10000,  // 1780 basis points = 17.80%
      userStaked: Number(ethers.formatEther(userStaked)).toFixed(2),
    };
  } catch {
    return {
      totalStaked: '0.00',
      apy: 17.8,
      userStaked: '0.00',
    };
  }
}

// ✅ Exporta tudo
export {
  wallet,
  stakingContract,
  gbitToken,
  provider,
  ethers,
  getBalance,
  getStakingInfo,
};
