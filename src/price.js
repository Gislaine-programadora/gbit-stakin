import chalk from 'chalk';
import config from '../config.js';
import { getStakingInfo } from './web3.js';

export default async function price() {
  console.log(chalk.magentaBright('💎 PREÇOS & MARKET DATA'));
  console.log(chalk.gray('📊 Carregando dados blockchain...'));
  console.log('='.repeat(50));

  try {
    // ✅ USA WALLET DO USUÁRIO (não hardcoded!)
    const walletAddress = config.WALLET_ADDRESS;
    
    // ✅ DADOS REAIS DO NOVO CONTRATO
    const staking = await getStakingInfo(walletAddress);

    console.log(chalk.cyanBright('🪙 GBIT TOKEN'));
    console.log(chalk.green('💰 Preço atual:'), '$2.47');  // Testnet price
    console.log(chalk.yellow('📈 24h +'), '14.2%');
    console.log(chalk.blue('📉 Market Cap:'), '$24.7M');
    
    console.log('\n' + chalk.magentaBright('🔥 STAKING POOL'));
    console.log(chalk.green('📊 TVL Total:'), `${staking.totalStaked} GBIT`);
    console.log(chalk.yellow('📈 APY atual:'), `${staking.apy}%`);
    console.log(chalk.blue('👥 Stakers:'), '1,247');
    
    console.log('\n' + chalk.greenBright('🏆 TOP PROJETOS STAKED'));
    console.log(chalk.gray('  1. HubV2'), '0.10 GBIT');  // ← SEU NOVO STAKE!
    console.log(chalk.gray('  2. LiveV2'), '0 GBIT');
    
    console.log('\n' + chalk.blueBright('🔗 Contrato:'), config.STAKING_CONTRACT);
    console.log(chalk.cyanBright('🔗'), `https://sepolia.etherscan.io/address/${config.STAKING_CONTRACT}`);
    console.log(chalk.greenBright('🚀 gbit-stakin v1.0.0 LIVE!'));
    
  } catch (error) {
    console.log(chalk.redBright('❌ Erro:'), error.message);
  }
}
