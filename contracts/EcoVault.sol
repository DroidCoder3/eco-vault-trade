// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract EcoVault is SepoliaConfig {
    using FHE for *;
    
    struct CarbonCredit {
        euint32 creditId;
        euint32 amount;
        euint32 price;
        euint32 carbonOffset;
        bool isActive;
        bool isVerified;
        string projectName;
        string location;
        address owner;
        uint256 timestamp;
    }
    
    struct Trade {
        euint32 tradeId;
        euint32 creditId;
        euint32 amount;
        euint32 price;
        address buyer;
        address seller;
        uint256 timestamp;
        bool isCompleted;
    }
    
    struct Portfolio {
        euint32 totalCredits;
        euint32 totalValue;
        euint32 carbonOffset;
        address owner;
    }
    
    mapping(uint256 => CarbonCredit) public carbonCredits;
    mapping(uint256 => Trade) public trades;
    mapping(address => Portfolio) public portfolios;
    mapping(address => euint32) public userReputation;
    
    uint256 public creditCounter;
    uint256 public tradeCounter;
    
    address public owner;
    address public verifier;
    
    event CreditCreated(uint256 indexed creditId, address indexed owner, string projectName);
    event TradeInitiated(uint256 indexed tradeId, uint256 indexed creditId, address indexed buyer);
    event TradeCompleted(uint256 indexed tradeId, address indexed buyer, address indexed seller);
    event CreditVerified(uint256 indexed creditId, bool isVerified);
    event ReputationUpdated(address indexed user, uint32 reputation);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function createCarbonCredit(
        string memory _projectName,
        string memory _location,
        uint256 _amount,
        uint256 _price,
        uint256 _carbonOffset
    ) public returns (uint256) {
        require(bytes(_projectName).length > 0, "Project name cannot be empty");
        require(_amount > 0, "Amount must be positive");
        require(_price > 0, "Price must be positive");
        
        uint256 creditId = creditCounter++;
        
        carbonCredits[creditId] = CarbonCredit({
            creditId: FHE.asEuint32(0), // Will be set properly later
            amount: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            price: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            carbonOffset: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            isActive: true,
            isVerified: false,
            projectName: _projectName,
            location: _location,
            owner: msg.sender,
            timestamp: block.timestamp
        });
        
        emit CreditCreated(creditId, msg.sender, _projectName);
        return creditId;
    }
    
    function initiateTrade(
        uint256 creditId,
        externalEuint32 amount,
        externalEuint32 price,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(carbonCredits[creditId].owner != address(0), "Credit does not exist");
        require(carbonCredits[creditId].isActive, "Credit is not active");
        require(carbonCredits[creditId].owner != msg.sender, "Cannot trade with yourself");
        
        uint256 tradeId = tradeCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalAmount = FHE.fromExternal(amount, inputProof);
        euint32 internalPrice = FHE.fromExternal(price, inputProof);
        
        trades[tradeId] = Trade({
            tradeId: FHE.asEuint32(0), // Will be set properly later
            creditId: FHE.asEuint32(0), // Will be set properly later
            amount: internalAmount,
            price: internalPrice,
            buyer: msg.sender,
            seller: carbonCredits[creditId].owner,
            timestamp: block.timestamp,
            isCompleted: false
        });
        
        emit TradeInitiated(tradeId, creditId, msg.sender);
        return tradeId;
    }
    
    function completeTrade(
        uint256 tradeId,
        externalEuint32 amount,
        externalEuint32 price,
        bytes calldata inputProof
    ) public payable {
        require(trades[tradeId].buyer != address(0), "Trade does not exist");
        require(trades[tradeId].buyer == msg.sender, "Only buyer can complete trade");
        require(!trades[tradeId].isCompleted, "Trade already completed");
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalAmount = FHE.fromExternal(amount, inputProof);
        euint32 internalPrice = FHE.fromExternal(price, inputProof);
        
        // Verify the trade parameters match
        require(FHE.eq(internalAmount, trades[tradeId].amount), "Amount mismatch");
        require(FHE.eq(internalPrice, trades[tradeId].price), "Price mismatch");
        
        // Mark trade as completed
        trades[tradeId].isCompleted = true;
        
        // Update portfolios
        address seller = trades[tradeId].seller;
        
        // Update buyer's portfolio
        portfolios[msg.sender].totalCredits = FHE.add(portfolios[msg.sender].totalCredits, internalAmount);
        portfolios[msg.sender].totalValue = FHE.add(portfolios[msg.sender].totalValue, FHE.mul(internalAmount, internalPrice));
        
        // Update seller's portfolio
        portfolios[seller].totalCredits = FHE.sub(portfolios[seller].totalCredits, internalAmount);
        portfolios[seller].totalValue = FHE.sub(portfolios[seller].totalValue, FHE.mul(internalAmount, internalPrice));
        
        emit TradeCompleted(tradeId, msg.sender, seller);
    }
    
    function verifyCredit(uint256 creditId, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify credits");
        require(carbonCredits[creditId].owner != address(0), "Credit does not exist");
        
        carbonCredits[creditId].isVerified = isVerified;
        emit CreditVerified(creditId, isVerified);
    }
    
    function updateReputation(address user, euint32 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        userReputation[user] = reputation;
        emit ReputationUpdated(user, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function getCreditInfo(uint256 creditId) public view returns (
        string memory projectName,
        string memory location,
        uint8 amount,
        uint8 price,
        uint8 carbonOffset,
        bool isActive,
        bool isVerified,
        address owner,
        uint256 timestamp
    ) {
        CarbonCredit storage credit = carbonCredits[creditId];
        return (
            credit.projectName,
            credit.location,
            0, // FHE.decrypt(credit.amount) - will be decrypted off-chain
            0, // FHE.decrypt(credit.price) - will be decrypted off-chain
            0, // FHE.decrypt(credit.carbonOffset) - will be decrypted off-chain
            credit.isActive,
            credit.isVerified,
            credit.owner,
            credit.timestamp
        );
    }
    
    function getTradeInfo(uint256 tradeId) public view returns (
        uint8 amount,
        uint8 price,
        address buyer,
        address seller,
        uint256 timestamp,
        bool isCompleted
    ) {
        Trade storage trade = trades[tradeId];
        return (
            0, // FHE.decrypt(trade.amount) - will be decrypted off-chain
            0, // FHE.decrypt(trade.price) - will be decrypted off-chain
            trade.buyer,
            trade.seller,
            trade.timestamp,
            trade.isCompleted
        );
    }
    
    function getPortfolioInfo(address user) public view returns (
        uint8 totalCredits,
        uint8 totalValue,
        uint8 carbonOffset
    ) {
        Portfolio storage portfolio = portfolios[user];
        return (
            0, // FHE.decrypt(portfolio.totalCredits) - will be decrypted off-chain
            0, // FHE.decrypt(portfolio.totalValue) - will be decrypted off-chain
            0  // FHE.decrypt(portfolio.carbonOffset) - will be decrypted off-chain
        );
    }
    
    function getUserReputation(address user) public view returns (uint8) {
        return 0; // FHE.decrypt(userReputation[user]) - will be decrypted off-chain
    }
}
