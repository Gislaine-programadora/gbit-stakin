import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const CONTRACT_ADDRESS = "0x64fc44cAFC219245A212A4a9ae8E6B240D080970";

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const balance = await provider.getBalance(CONTRACT_ADDRESS);
  console.log("💰 Saldo do contrato:", ethers.formatEther(balance), "ETH");
}

main();
