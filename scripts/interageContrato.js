import { ethers } from "ethers"; // Importa ethers diretamente
import hardhat from "hardhat"; // Importa o hardhat

async function main() {
  const stakingAddress = "0xB9178cc9B16D4428d0f7ac29EBD933551F2a41b6"; // Endereço do seu contrato
  const GbitStaking = await hardhat.ethers.getContractFactory("GbitStaking");
  const staking = await GbitStaking.attach(stakingAddress);

  // Exemplo: Verificar APY
  const apy = await staking.getAPY();
  console.log(`APY atual: ${apy}`);

  // Exemplo: Stake de tokens
  const amountToStake = ethers.utils.parseUnits("10", 18); // 10 GBIT
  const stakeTx = await staking.stake(amountToStake);
  await stakeTx.wait();
  console.log(`Você fez stake de 10 GBIT.`);

  // Exemplo: Pegar um empréstimo
  const loanAmount = ethers.utils.parseUnits("5", 18); // 5 ETH
  const loanTx = await staking.takeLoan(loanAmount);
  await loanTx.wait();
  console.log(`Você pegou emprestado ${ethers.utils.formatUnits(loanAmount, 18)} ETH.`);

  // Exemplo: Pagar o empréstimo
  const repaymentAmount = loanAmount.add(loanAmount.mul(5).div(100)); // Inclui 5% de juros
  const repayTx = await staking.repayLoan(repaymentAmount);
  await repayTx.wait();
  console.log(`Você pagou ${ethers.utils.formatUnits(repaymentAmount, 18)} ETH de volta ao contrato.`);
}

main().catch((error) => {
  console.error("Erro:", error);
  process.exitCode = 1;
});