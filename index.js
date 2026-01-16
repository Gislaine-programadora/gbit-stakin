#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import { config } from 'dotenv';
import { ethers } from 'ethers';

import balance from './src/balance.js';
import stake from './src/stake.js';
import price from './src/price.js';
import unstake from './src/unstake.js';
import init from './src/init.js';

config({ path: '.env' });

const program = new Command()
  .version('1.0.0')
  .description('Staking CLI para projetos gbit');

// ✅ COMANDOS EXISTENTES
program
  .command('balance')
  .description('💰 Ver saldo e staking atual')
  .action(balance);

program
  .command('stake <projeto> [amount]')
  .description('🔥 Stake em projeto (default: 100 GBIT)')
  .action(stake);

program
  .command('unstake <amount>')
  .description('💸 Retirar GBIT do staking')
  .action(unstake);

program
  .command('price')
  .description('💎 Preços e APY atual')
  .action(price);

program
  .command('init <project-name>')
  .description('📦 Criar um novo projeto de staking (gera pasta + .env)')
  .action(init);

// 🔥 COMANDO APPROVE
program
  .command('approve [amount]')
  .description('✅ Aprovar GBIT para staking (default: 1000 GBIT)')
  .action(async (amount = '1000') => {
    try {
      console.log(chalk.yellow('🚀 APROVANDO GBIT para Staking...'));
      
      const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || process.env.SEPOLIA_RPC_URL);
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      
      const gbitToken = new ethers.Contract(
        process.env.GBIT_TOKEN_ADDRESS,
        ['function approve(address spender, uint256 amount) public returns (bool)'],
        wallet
      );
      
      const approveAmount = ethers.parseEther(amount);
      const stakingContract = process.env.STAKING_CONTRACT;
      
      console.log(chalk.cyan(`📝 Aprovando ${amount} GBIT para:`));
      console.log(chalk.white(`   Staking: ${stakingContract}`));
      
      const tx = await gbitToken.approve(stakingContract, approveAmount);
      console.log(chalk.yellow(`⏳ TX: ${tx.hash}`));
      
      const receipt = await tx.wait();
      console.log(chalk.green('✅ APPROVAL OK! Gas usado:', receipt.gasUsed.toString()));
      console.log(chalk.greenBright('💡 Agora pode usar: gbit-stakin stake "Projeto" 0.1'));
      
    } catch (error) {
      console.error(chalk.red('❌ ERRO APPROVAL:'), error.message);
    }
  });

// 🔥 LOGO ROSA APÓS COMANDOS (CORREÇÃO!)
console.log(chalk.redBright(`
   ▄██████▄  ▀█████████▄   ▄█      ███     
  ███    ███   ███    ███ ███  ▀█████████▄ 
  ███    █▀    ███    ███ ███▌    ▀███▀▀██ 
 ▄███         ▄███▄▄▄██▀  ███▌     ███   ▀ 
▀▀███ ████▄  ▀▀███▀▀▀██▄  ███▌     ███     
  ███    ███   ███    ██▄ ███      ███     
  ███    ███   ███    ███ ███      ███     
  ████████▀  ▄█████████▀  █▀      ▄████▀   
`));

console.log(chalk.yellow('═'.repeat(50)));
console.log(chalk.blue('🚀 CLI Staking Profissional - Web3 Real'));
console.log();

program.parse();
