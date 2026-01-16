import "@nomicfoundation/hardhat-ethers";
import hre from "hardhat";

async function main() {
  const stakingAddress = process.env.STAKING_CONTRACT || "0x19861B8C9BF3cB96865dAeD37058d661954BF6C6";
  const [owner] = await hre.ethers.getSigners();

  const GbitStaking = await hre.ethers.getContractFactory("GbitStaking");
  const staking = await GbitStaking.attach(stakingAddress);

  console.log("🚀 Atualizando APY...");
  const tx = await staking.connect(owner).setAPY(12200); // Definindo APY para 12.200%
  await tx.wait();

  console.log("✅ APY atualizado para 12.200%");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
