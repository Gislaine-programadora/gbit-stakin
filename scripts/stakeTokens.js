import "@nomicfoundation/hardhat-ethers";
import hre from "hardhat";

async function main() {
  console.log("🚀 Iniciando stake de GBIT...");

  // Endereço do contrato GBIT (ERC20) já implantado
  const gbitTokenAddress = "0x64fc44cAFC219245A212A4a9ae8E6B240D080970"; // Sepolia
  // const gbitTokenAddress = "ENDERECO_DO_CONTRATO_NA_MAINNET"; // Mainnet

  // Endereço do contrato de Staking já implantado
  const stakingAddress = "ENDERECO_DO_CONTRATO_STAKING"; // substitua pelo deploy real

  // Quantidade de tokens a fazer stake
  const amount = "100"; // 100 GBIT

  // Conecta ao contrato ERC20
  const GbitToken = await hre.ethers.getContractFactory("GbitToken");
  const gbitToken = await GbitToken.attach(gbitTokenAddress);

  // Conecta ao contrato de Staking
  const GbitStaking = await hre.ethers.getContractFactory("GbitStaking");
  const staking = await GbitStaking.attach(stakingAddress);

  // Converte para unidades com 18 decimais
  const amountInWei = hre.ethers.parseUnits(amount, 18);

  console.log(`💼 Aprovando ${amount} GBIT para o contrato de Staking...`);
  const approveTx = await gbitToken.approve(stakingAddress, amountInWei);
  await approveTx.wait();
  console.log(`✅ Aprovação concluída! Hash: ${approveTx.hash}`);

  console.log(`🔥 Fazendo stake de ${amount} GBIT...`);
  const stakeTx = await staking.stake(amountInWei);
  await stakeTx.wait();
  console.log(`✅ Stake concluído! Hash: ${stakeTx.hash}`);

  // Confere saldo em stake
  const userStake = await staking.getUserStake(await hre.ethers.provider.getSigner().getAddress());
  console.log(`📊 Saldo em stake: ${hre.ethers.formatUnits(userStake, 18)} GBIT`);
}

main().catch((error) => {
  console.error("❌ Erro no stake:", error);
  process.exitCode = 1;
});
