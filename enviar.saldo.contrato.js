import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// Endereço do contrato já implantado (puxado do .env)
const CONTRACT_ADDRESS = process.env.STAKING_CONTRACT || "0x19861B8C9BF3cB96865dAeD37058d661954BF6C6";

async function main() {
  // Conecta ao RPC Sepolia
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

  // Cria a carteira a partir da chave privada
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("📤 Enviando ETH para o contrato:", CONTRACT_ADDRESS);

  // Monta a transação
  const tx = await wallet.sendTransaction({
    to: CONTRACT_ADDRESS,
    value: ethers.parseEther("0.145"), // 0.145 ETH
  });

  console.log("⏳ Transação enviada:", tx.hash);

  // Aguarda confirmação
  await tx.wait();
  console.log("✅ ETH enviado com sucesso!");
}

main().catch((error) => {
  console.error("❌ Erro:", error);
  process.exitCode = 1;
});
