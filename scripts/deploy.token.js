import "@nomicfoundation/hardhat-ethers";
import dotenv from "dotenv";
import hre from "hardhat";

dotenv.config();

async function main() {
  console.log("Iniciando a implantação do GbitToken...");

  // Suprimento inicial (contrato multiplica por 10^18 internamente)
  const initialSupply = 1000000; 

  // Preço inicial em ETH convertido para Wei
  const initialTokenPriceInEth = hre.ethers.parseEther("753.09");

  console.log(`Parâmetros de implantação:
    Initial Supply: ${initialSupply} GBIT
    Initial Price: ${hre.ethers.formatEther(initialTokenPriceInEth)} ETH por GBIT
  `);

  const GbitToken = await hre.ethers.getContractFactory("GbitToken");

  console.log("Implantando GbitToken...");
  const gbitToken = await GbitToken.deploy(
    initialSupply,
    initialTokenPriceInEth // ✅ agora é inteiro em Wei
  );

  await gbitToken.waitForDeployment();

  const contractAddress = await gbitToken.getAddress();
  console.log(`✅ GbitToken implantado em: ${contractAddress}`);

  const owner = await gbitToken.owner();
  const ownerBalance = await gbitToken.balanceOf(owner);
  console.log(`💼 Balanço do proprietário (${owner}): ${hre.ethers.formatUnits(ownerBalance, 18)} GBIT`);

  const currentTokenPriceInWei = await gbitToken.tokenPriceInWei();
  console.log(`💎 Preço atual do token (em Wei): ${currentTokenPriceInWei}`);
  console.log(`💎 Preço atual do token (em ETH): ${hre.ethers.formatEther(currentTokenPriceInWei)} ETH por GBIT`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
