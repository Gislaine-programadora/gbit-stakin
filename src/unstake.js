// src/unstake.js - VERSÃO FINAL
import chalk from 'chalk';
import { ethers } from 'ethers';
import config from '../config.js';

export default async function unstake(amount = '0.05') {
  console.log(chalk.redBright(`💸 UNSTAKE INICIADO`));
  console.log(chalk.red(`🔓 Retirando ${amount} GBIT...`));

  try {
    const provider = new ethers.JsonRpcProvider('https://ethereum-sepolia.publicnode.com');
    const wallet = new ethers.Wallet(config.PRIVATE_KEY, provider);
    
    // ✅ ABI EXATA do seu contrato
    const contract = new ethers.Contract(config.STAKING_CONTRACT, [
      'function unstake(uint256 amount) external',
      'function getUserStake(address user) external view returns (uint256)'
    ], wallet);

    // 🔍 VERIFICA SALDO STAKED PRIMEIRO
    const stakedBalance = await contract.getUserStake(wallet.address);
    console.log(chalk.gray(`📊 Seu stake atual: ${ethers.formatEther(stakedBalance)} GBIT`));
    
    if (stakedBalance === 0n) {
      console.log(chalk.yellow('⚠️'), 'Nenhum GBIT staked. Faça stake primeiro!');
      return;
    }

    const amountWei = ethers.parseEther(amount);
    require(stakedBalance >= amountWei, "Saldo insuficiente");

    // UNSTAKE REAL - DIRETO
    console.log(chalk.blue('⏳'), 'Executando unstake...');
    const tx = await contract.unstake(amountWei, { gasLimit: 300000 });
    
    console.log(chalk.greenBright('📝'), `TX: https://sepolia.etherscan.io/tx/${tx.hash}`);
    const receipt = await tx.wait();
    
    console.log(chalk.green('✅'), `UNSTAKE CONFIRMADO! Block: ${receipt.blockNumber}`);
    console.log(chalk.cyanBright('🔗'), `https://sepolia.etherscan.io/tx/${tx.hash}`);

  } catch (error) {
    console.log(chalk.redBright('❌'), error.message);
  }
}
