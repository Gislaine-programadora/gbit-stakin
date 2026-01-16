import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// Endereço do contrato GbitStaking já implantado na Sepolia
const CONTRACT_ADDRESS = "0xB9178cc9B16D4428d0f7ac29EBD933551F2a41b6"

// ABI mínima só com a função withdraw
const ABI = [
  "function withdraw(uint256 amount) external"
];

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("📤 Fazendo saque do contrato...");

  // Conecta ao contrato
  const staking = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

  // Define o valor a sacar (exemplo: 0.1 ETH)
  const amount = ethers.parseEther("0.1");

  // Chama a função withdraw
  const tx = await staking.withdraw(amount);
  console.log("⏳ Transação enviada:", tx.hash);

  // Aguarda confirmação
  await tx.wait();
  console.log("✅ Saque realizado com sucesso!");
}

main().catch((error) => {
  console.error("❌ Erro:", error);
  process.exitCode = 1;
});
