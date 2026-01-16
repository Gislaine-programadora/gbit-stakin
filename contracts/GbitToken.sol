// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


/**
 * @title GbitToken
 * @dev Token ERC20 com compra e venda via ETH
 *      - Preço do token armazenado em Wei por 1 token (com 18 decimais)
 *      - Compra e venda ajustadas para 18 decimais
 *      - Suprimento inicial cunhado para o proprietário (msg.sender)
 */
contract GbitToken is ERC20, Ownable, ReentrancyGuard {

    uint256 public tokenPriceInWei;

    event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 tokenAmount);
    event TokensSold(address indexed seller, uint256 tokenAmount, uint256 ethAmount);
    event TokenPriceUpdated(uint256 oldPrice, uint256 newPrice);
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    /**
     * @param initialSupply Quantidade inicial em unidades inteiras (sem 10^18). Ex.: 1_000_000
     * @param initialTokenPriceInWei Preço de 1 token em Wei (use parseEther no deploy)
     */
    constructor(
        uint256 initialSupply,
        uint256 initialTokenPriceInWei
    ) ERC20("Gbit Token", "GBIT") Ownable(msg.sender) {
        // Cunha para o proprietário (com 18 decimais)
        _mint(msg.sender, initialSupply * 10 ** decimals());

        // Preço já vem em Wei — não multiplicar novamente
        require(initialTokenPriceInWei > 0, "Preco invalido");
        tokenPriceInWei = initialTokenPriceInWei;

        emit TokenPriceUpdated(0, tokenPriceInWei);
    }

    /**
     * @dev Define o preço do token em Wei por 1 token (com 18 decimais)
     *      Passe valor em Wei (use parseEther no front/deploy)
     */
    function setTokenPrice(uint256 newTokenPriceInWei) external onlyOwner {
        require(newTokenPriceInWei > 0, "Preco invalido");
        uint256 old = tokenPriceInWei;
        tokenPriceInWei = newTokenPriceInWei;
        emit TokenPriceUpdated(old, tokenPriceInWei);
    }

    /**
     * @dev Compra tokens enviando ETH. Calcula quantidade considerando 18 decimais.
     *      tokensToBuy = (msg.value * 10^decimals) / tokenPriceInWei
     */
    function buyTokens() external payable nonReentrant {
        require(msg.value > 0, "Envie ETH");
        uint256 tokensToBuy = (msg.value * (10 ** decimals())) / tokenPriceInWei;
        require(tokensToBuy > 0, "ETH insuficiente");
        require(balanceOf(owner()) >= tokensToBuy, "Sem tokens do owner");

        _transfer(owner(), msg.sender, tokensToBuy);
        emit TokensPurchased(msg.sender, msg.value, tokensToBuy);
    }

    /**
     * @dev Vende tokens e recebe ETH. Calcula ETH considerando 18 decimais.
     *      ethAmount = (amount * tokenPriceInWei) / 10^decimals
     */
    function sellTokens(uint256 amount) external nonReentrant {
        require(amount > 0, "Valor invalido");

        uint256 ethAmount = (amount * tokenPriceInWei) / (10 ** decimals());
        require(address(this).balance >= ethAmount, "Sem ETH");

        _transfer(msg.sender, owner(), amount);

        (bool ok,) = payable(msg.sender).call{value: ethAmount}("");
        require(ok, "Falha ETH");

        emit TokensSold(msg.sender, amount, ethAmount);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
        emit TokensBurned(from, amount);
    }

    receive() external payable {}
}
