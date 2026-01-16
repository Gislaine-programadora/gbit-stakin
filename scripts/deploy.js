import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  console.log("🚀 Fazendo deploy do contrato GbitStaking...");

  // Endereço do contrato ERC20 GBIT já implantado na Sepolia
  const gbitTokenAddress = "0x64fc44cAFC219245A212A4a9ae8E6B240D080970";

  // Obtém a fábrica do contrato
  const GbitStaking = await ethers.getContractFactory("GbitStaking");

  // Faz o deploy passando o endereço do token
  const staking = await GbitStaking.deploy(gbitTokenAddress);

  await staking.waitForDeployment();

  console.log("✅ GbitStaking deployado em:", await staking.getAddress());
}

main().catch((error) => {
  console.error("❌ Erro no deploy:", error);
  process.exitCode = 1;
});
