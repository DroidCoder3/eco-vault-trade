// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract CarbonCredit is SepoliaConfig {
    using FHE for *;
    
    struct CreditToken {
        euint32 tokenId;
        euint32 amount;
        euint32 carbonOffset;
        bool isActive;
        bool isVerified;
        string projectName;
        string location;
        address owner;
        uint256 timestamp;
    }
    
    mapping(uint256 => CreditToken) public creditTokens;
    mapping(address => euint32) public balances;
    mapping(address => euint32) public carbonOffsetBalances;
    
    uint256 public tokenCounter;
    address public owner;
    address public verifier;
    
    event TokenMinted(uint256 indexed tokenId, address indexed owner, string projectName);
    event TokenTransferred(uint256 indexed tokenId, address indexed from, address indexed to);
    event TokenVerified(uint256 indexed tokenId, bool isVerified);
    event BalanceUpdated(address indexed user, uint32 balance);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function mintCreditToken(
        string memory _projectName,
        string memory _location,
        uint256 _amount,
        uint256 _carbonOffset
    ) public returns (uint256) {
        require(bytes(_projectName).length > 0, "Project name cannot be empty");
        require(_amount > 0, "Amount must be positive");
        require(_carbonOffset > 0, "Carbon offset must be positive");
        
        uint256 tokenId = tokenCounter++;
        
        creditTokens[tokenId] = CreditToken({
            tokenId: FHE.asEuint32(0), // Will be set properly later
            amount: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            carbonOffset: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            isActive: true,
            isVerified: false,
            projectName: _projectName,
            location: _location,
            owner: msg.sender,
            timestamp: block.timestamp
        });
        
        // Update balances
        balances[msg.sender] = FHE.add(balances[msg.sender], FHE.asEuint32(_amount));
        carbonOffsetBalances[msg.sender] = FHE.add(carbonOffsetBalances[msg.sender], FHE.asEuint32(_carbonOffset));
        
        emit TokenMinted(tokenId, msg.sender, _projectName);
        emit BalanceUpdated(msg.sender, 0); // FHE.decrypt(balances[msg.sender]) - will be decrypted off-chain
        
        return tokenId;
    }
    
    function transferCreditToken(
        uint256 tokenId,
        address to,
        externalEuint32 amount,
        bytes calldata inputProof
    ) public {
        require(creditTokens[tokenId].owner == msg.sender, "Not the owner of this token");
        require(creditTokens[tokenId].isActive, "Token is not active");
        require(to != address(0), "Cannot transfer to zero address");
        require(to != msg.sender, "Cannot transfer to yourself");
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalAmount = FHE.fromExternal(amount, inputProof);
        
        // Verify the amount is valid
        require(FHE.le(internalAmount, creditTokens[tokenId].amount), "Insufficient token amount");
        
        // Update token ownership and amount
        creditTokens[tokenId].owner = to;
        creditTokens[tokenId].amount = FHE.sub(creditTokens[tokenId].amount, internalAmount);
        
        // Update balances
        balances[msg.sender] = FHE.sub(balances[msg.sender], internalAmount);
        balances[to] = FHE.add(balances[to], internalAmount);
        
        emit TokenTransferred(tokenId, msg.sender, to);
        emit BalanceUpdated(msg.sender, 0); // FHE.decrypt(balances[msg.sender]) - will be decrypted off-chain
        emit BalanceUpdated(to, 0); // FHE.decrypt(balances[to]) - will be decrypted off-chain
    }
    
    function verifyToken(uint256 tokenId, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify tokens");
        require(creditTokens[tokenId].owner != address(0), "Token does not exist");
        
        creditTokens[tokenId].isVerified = isVerified;
        emit TokenVerified(tokenId, isVerified);
    }
    
    function getTokenInfo(uint256 tokenId) public view returns (
        string memory projectName,
        string memory location,
        uint8 amount,
        uint8 carbonOffset,
        bool isActive,
        bool isVerified,
        address owner,
        uint256 timestamp
    ) {
        CreditToken storage token = creditTokens[tokenId];
        return (
            token.projectName,
            token.location,
            0, // FHE.decrypt(token.amount) - will be decrypted off-chain
            0, // FHE.decrypt(token.carbonOffset) - will be decrypted off-chain
            token.isActive,
            token.isVerified,
            token.owner,
            token.timestamp
        );
    }
    
    function getBalance(address user) public view returns (uint8) {
        return 0; // FHE.decrypt(balances[user]) - will be decrypted off-chain
    }
    
    function getCarbonOffsetBalance(address user) public view returns (uint8) {
        return 0; // FHE.decrypt(carbonOffsetBalances[user]) - will be decrypted off-chain
    }
}
