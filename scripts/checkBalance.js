import "@nomicfoundation/hardhat-ethers";
import hre from "hardhat";

// Endereço que você quer consultar
const targetAddress = "0x297e1984BF7Da594a34E88Ecadf7B47bBbb3A5c2";

async function main() {
  const GbitToken = await hre.ethers.getContractFactory("GbitToken");
  const gbitToken = await GbitToken.attach("0x637b29103895B01BE061001086385fbAC656c5CF");

  console.log(`🔍 Consultando saldo de GBIT para: ${targetAddress}`);

  const balance = await gbitToken.balanceOf(targetAddress);
  const balanceFormatted = hre.ethers.formatUnits(balance, 18);
  console.log(`💼 Saldo de GBIT: ${balanceFormatted}`);

  const tokenPriceInWei = await gbitToken.tokenPriceInWei();
  const tokenPriceInEth = hre.ethers.formatEther(tokenPriceInWei);
  console.log(`💎 Preço atual do token: ${tokenPriceInEth} ETH por GBIT`);

  const valueInWei = balance * tokenPriceInWei;
  const valueInEth = hre.ethers.formatEther(valueInWei.toString());
  console.log(`💰 Valor estimado em ETH: ${valueInEth}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
