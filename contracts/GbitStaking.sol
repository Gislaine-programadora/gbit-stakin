// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract GbitStaking is ReentrancyGuard {
    address public owner;
    uint256 public totalStaked;
    uint256 public apy = 100; // 100% ao ano (exemplo)
    uint256 public loanInterestRate = 5; // Taxa de juros de 5%

    IERC20 public gbitToken;
    mapping(address => uint256) public userStaked;
    mapping(address => uint256) public stakeTimestamp;
    mapping(address => uint256) public userLoans;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);
    event APYUpdated(uint256 oldAPY, uint256 newAPY);
    event DepositedETH(address indexed user, uint256 amount);
    event WithdrawnETH(address indexed user, uint256 amount);
    event LoanTaken(address indexed user, uint256 amount);
    event LoanRepaid(address indexed user, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _gbitToken) {
        owner = msg.sender;
        gbitToken = IERC20(_gbitToken);
    }

    // Função para depositar ETH
    receive() external payable {
        emit DepositedETH(msg.sender, msg.value);
    }

    // Função para retirar ETH
    function withdrawETH(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(address(this).balance >= amount, "Insufficient contract balance");
        payable(msg.sender).transfer(amount);
        emit WithdrawnETH(msg.sender, amount);
    }

    // Função de staking
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");

        // 🔧 Ajuste: não depende do retorno booleano
        gbitToken.transferFrom(msg.sender, address(this), amount);

        userStaked[msg.sender] += amount;
        stakeTimestamp[msg.sender] = block.timestamp;
        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    // Função de unstaking
    function unstake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(userStaked[msg.sender] >= amount, "Insufficient stake");

        uint256 stakedTime = block.timestamp - stakeTimestamp[msg.sender];
        uint256 reward = (amount * apy * stakedTime) / (365 days * 100);

        userStaked[msg.sender] -= amount;
        totalStaked -= amount;

        // 🔧 Ajuste: não depende do retorno booleano
        gbitToken.transfer(msg.sender, amount + reward);

        emit Unstaked(msg.sender, amount, reward);
    }

    // Função para pegar um empréstimo
    function takeLoan(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(userStaked[msg.sender] > 0, "No stake found");
        
        uint256 collateralValue = userStaked[msg.sender];
        require(amount <= collateralValue / 2, "Loan exceeds collateral limit");

        userLoans[msg.sender] += amount;
        payable(msg.sender).transfer(amount);

        emit LoanTaken(msg.sender, amount);
    }

    // Função para pagar o empréstimo
    function repayLoan(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(userLoans[msg.sender] >= amount, "Repayment exceeds loan amount");

        uint256 totalRepayment = amount + (amount * loanInterestRate) / 100;
        require(address(this).balance >= totalRepayment, "Insufficient contract balance to repay loan");

        userLoans[msg.sender] -= amount;
        payable(address(this)).transfer(totalRepayment);

        emit LoanRepaid(msg.sender, totalRepayment);
    }

    // Função para atualizar APY
    function setAPY(uint256 newAPY) external onlyOwner {
        uint256 old = apy;
        apy = newAPY;
        emit APYUpdated(old, newAPY);
    }

    // Funções de visualização
    function getUserStake(address user) external view returns (uint256) {
        return userStaked[user];
    }

    function getAPY() external view returns (uint256) {
        return apy;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
