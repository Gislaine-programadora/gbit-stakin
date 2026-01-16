import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  // Endereço do contrato de staking
  const stakingAddress = process.env.STAKING_CONTRACT;

  // Conecta ao RPC Sepolia
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

  // Cria a carteira a partir da chave privada
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // ABI mínima só com a função de leitura
  const abi = [
    "function getUserStake(address user) external view returns (uint256)"
  ];

  // Instancia o contrato
  const stakingContract = new ethers.Contract(stakingAddress, abi, provider);

  // Consulta stake da sua wallet
  const stakeBalance = await stakingContract.getUserStake(wallet.address);

  console.log("👤 Wallet:", wallet.address);
  console.log("📊 Stake em GBIT:", ethers.formatUnits(stakeBalance, 18), "GBIT");
}

main().catch((error) => {
  console.error("❌ Erro:", error);
  process.exitCode = 1;
});
