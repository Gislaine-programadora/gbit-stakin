import { ethers } from 'ethers';
import chalk from 'chalk';

export default async function balance() {
  try {
    console.log(chalk.cyanBright('💰 SALDO & BALANÇO EMPRESARIAL'));
    console.log(chalk.gray('🔗 Conectando blockchain...'));

    // 🔥 RPC FALLBACK Sepolia → Mainnet
    const rpcUrls = [
      'https://ethereum-sepolia.publicnode.com',  // Sepolia #1
      'https://rpc.sepolia.org',
      'https://eth.llamarpc.com',                // Mainnet
      'https://mainnet.infura.io/v3/' + process.env.INFURA_KEY
    ];
    
    const provider = new ethers.JsonRpcProvider(rpcUrls[0]);
    
    // ENDEREÇOS FIXOS (sem config quebrado)
    const STAKING_CONTRACT = process.env.STAKING_CONTRACT || '0x19861B8C9BF3cB96865dAeD37058d661954BF6C6';

    const GBIT_TOKEN_ADDRESS = process.env.GBIT_TOKEN_ADDRESS || '0x64fc44cAFC219245A212A4a9ae8E6B240D080970';
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    
    if (!PRIVATE_KEY) {
      console.log(chalk.red('❌ PRIVATE_KEY não configurado no .env'));
      return;
    }
    
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    
    // GBIT Token
    const gbitToken = new ethers.Contract(
      GBIT_TOKEN_ADDRESS,
      ['function balanceOf(address) view returns (uint256)'],
      provider
    );
    
    // Staking Contract
    const stakingContract = new ethers.Contract(
      STAKING_CONTRACT,
      [
        'function getUserStake(address user) external view returns (uint256)',
        'function totalStaked() external view returns (uint256)',
        'function getAPY() external view returns (uint256)'
      ],
      provider
    );

    console.log(chalk.gray('⏳ Buscando dados...'));
    
    // BALANCES PARALELOS
    const [tokenBalance, stakedBalance, totalPool, apy] = await Promise.all([
      gbitToken.balanceOf(wallet.address),
      stakingContract.getUserStake(wallet.address),
      stakingContract.totalStaked(),
      stakingContract.getAPY()
    ]);

    console.log(chalk.green('👤 WALLET:'), `${wallet.address.slice(0,6)}...${wallet.address.slice(-6)}`);
    console.log(chalk.yellow('💵 Saldo Livre:'), `${ethers.formatEther(tokenBalance)} GBIT`);
    console.log(chalk.redBright('🔥 Seu Stake:'), `${ethers.formatEther(stakedBalance)} GBIT`);
    console.log(chalk.blue('📈 APY Atual:'), `${Number(apy) / 10000}%`);
    console.log(chalk.magenta('🏢 Total Pool:'), `${ethers.formatEther(totalPool)} GBIT`);
    console.log(chalk.cyanBright('🔗'), `https://sepolia.etherscan.io/address/${STAKING_CONTRACT}`);

  } catch (error) {
    console.log(chalk.red('❌ ERRO BALANCE:'), error.message);
    console.log(chalk.yellow('🔧 Verifique .env → STAKING_CONTRACT e PRIVATE_KEY'));
  }
}
