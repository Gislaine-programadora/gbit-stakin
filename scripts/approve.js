const { ethers } = require("hardhat");

async function main() {
  // Endereço do token GBIT
  const gbitTokenAddress = process.env.GBIT_TOKEN_ADDRESS || "0x64fc44cAFC219245A212A4a9ae8E6B240D080970";
  // Endereço do contrato de staking
  const stakingContractAddress = process.e0xB9178cc9B16D4428d0f7ac29EBD933551F2a41b6";

  // Instancia o contrato ERC20
  const gbitToken = await ethers.getContractAt("IERC20", gbitTokenAddress);

  // Quantidade a aprovar
  const APPROVAL = ethers.utils.parseEther("1000");

  console.log("🚀 APROVANDO 1000 GBIT para o contrato de staking...");
  const tx = await gbitToken.approve(stakingContractAddress, APPROVAL);
  await tx.wait();
  console.log("✅ APPROVAL OK! TX:", tx.hash);
}

main().catch(console.error);