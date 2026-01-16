import "@nomicfoundation/hardhat-ethers";
import hre from "hardhat";

async function main() {
  // Endereço do contrato GBIT já implantado
  const contractAddress = "0x64fc44cAFC219245A212A4a9ae8E6B240D080970";

  // Endereço de destino (quem vai receber os tokens)
  const recipient = "0x297e1984BF7Da594a34E88Ecadf7B47bBbb3A5c2";

  // Quantidade de tokens a enviar (em GBIT, não em Wei)
  const amount = "100"; // 100 GBIT

  // Conecta ao contrato
  const GbitToken = await hre.ethers.getContractFactory("GbitToken");
  const gbitToken = await GbitToken.attach(contractAddress);

  // Converte para unidades com 18 decimais
  const amountInWei = hre.ethers.parseUnits(amount, 18);

  console.log(`🚀 Enviando ${amount} GBIT para ${recipient}...`);

  // Executa a transferência
  const tx = await gbitToken.transfer(recipient, amountInWei);
  await tx.wait();

  console.log(`✅ Transferência concluída! Hash da transação: ${tx.hash}`);

  // Confere saldo do destinatário
  const balance = await gbitToken.balanceOf(recipient);
  console.log(`💼 Saldo do destinatário: ${hre.ethers.formatUnits(balance, 18)} GBIT`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
