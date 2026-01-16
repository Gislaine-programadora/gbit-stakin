import { ethers } from 'ethers';
import config from '../config.js';
import chalk from 'chalk';

export default async function stake(amount = '0.1') {
  try {
    // 🔥 RPC MULTI-REDE Sepolia + Mainnet
    const rpcUrls = [
      config.RPC_URL || 'https://sepolia.infura.io/v3/efeec6cf8cfd4d2d82ed5381d6568fc6',
      'https://ethereum-sepolia.publicnode.com',
      'https://rpc.sepolia.org',
      'https://eth.llamarpc.com' // Mainnet fallback
    ];
    
    const provider = new ethers.JsonRpcProvider(rpcUrls[0]);
    const wallet = new ethers.Wallet(config.PRIVATE_KEY, provider);
    
    // ✅ ABI corrigida (somente stake(uint256))
    const contract = new ethers.Contract(
      config.STAKING_CONTRACT,
      [
        'function stake(uint256 amount) external',
        'function getUserStake(address user) external view returns (uint256)'
      ],
      wallet
    );

    // ✅ Conversão correta para 18 decimais
    const amountWei = ethers.parseUnits(amount.toString(), 18);

    console.log(chalk.redBright('🔥'), `STAKING`);
    console.log(chalk.yellow('💼'), `Quantidade: ${amount} GBIT`);
    console.log(chalk.gray('⏳'), 'Preparando transação Web3...');
    console.log(chalk.gray('📋'), `Para contrato: ${config.STAKING_CONTRACT}`);

    // 🔍 Envia transação
    const tx = await contract.stake(amountWei);

    console.log(chalk.greenBright('📝'), `TX: https://sepolia.etherscan.io/tx/${tx.hash}`);
    console.log(chalk.yellow('⏳'), 'Aguardando confirmação...');

    const receipt = await tx.wait();
    
    if (receipt.status === 1) {
      console.log(chalk.greenBright('✅'), `Stake CONCLUÍDO! Block: ${receipt.blockNumber}`);
      console.log(chalk.gray('💼'), `Staked com ${amount} GBIT`);
      console.log(chalk.cyanBright('🔗'), `https://sepolia.etherscan.io/tx/${tx.hash}`);
    } else {
      console.log(chalk.red('❌'), 'Falha na transação - verifique Etherscan');
    }
    
  } catch (error) {
    console.log(chalk.redBright('❌'), `ERRO: ${error.reason || error.message}`);
    console.log(chalk.yellow('💡'), 'Diagnóstico técnico:');
    console.log(chalk.gray('- Verifique allowance no Etherscan'));
    console.log(chalk.gray('- Confirme GBIT balance da wallet'));
    console.log(chalk.gray('- Contrato possui função stake(uint256)?'));
    console.log(chalk.cyanBright('🔗'), `https://sepolia.etherscan.io/address/${config.STAKING_CONTRACT}`);
    console.log(chalk.cyanBright('🔗'), `https://sepolia.etherscan.io/tx/${error.transactionHash || 'PENDENTE'}`);
  }
}
