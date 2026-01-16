import "@nomicfoundation/hardhat-ethers";
import hre from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  // Endereço do contrato GBIT (ERC20)
  const gbitTokenAddress = process.env.GBIT_TOKEN_ADDRESS;
  if (!gbitTokenAddress) {
    throw new Error("❌ GBIT_TOKEN_ADDRESS não definido no .env");
  }

  // Endereço do contrato de Staking
  const stakingAddress = process.env.STAKING_CONTRACT;
  if (!stakingAddress) {
    throw new Error("❌ STAKING_CONTRACT não definido no .env");
  }

  // Pega a primeira conta configurada no Hardhat (deployer)
  const [signer] = await hre.ethers.getSigners();

  // Conecta ao contrato GBIT usando apenas a interface ERC20
  const gbitToken = await hre.ethers.getContractAt("IERC20", gbitTokenAddress);

  // Consulta allowance
  const allowance = await gbitToken.allowance(signer.address, stakingAddress);

  console.log("👤 Wallet:", signer.address);
  console.log("📜 Staking Contract:", stakingAddress);
  console.log("✅ Allowance:", hre.ethers.utils.formatUnits(allowance, 18), "GBIT");
}

main().catch((error) => {
  console.error("❌ Erro:", error);
  process.exit(1);
});
