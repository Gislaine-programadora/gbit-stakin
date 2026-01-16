import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const balance = await provider.getBalance("0x19861B8C9BF3cB96865dAeD37058d661954BF6C6")

  console.log("Saldo da conta:", ethers.formatEther(balance), "ETH");
}

main();
