// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract Verification is SepoliaConfig {
    using FHE for *;
    
    struct VerificationRequest {
        euint32 requestId;
        euint32 creditId;
        euint32 verificationScore;
        bool isApproved;
        bool isProcessed;
        string verificationData;
        address requester;
        address verifier;
        uint256 timestamp;
    }
    
    struct VerifierProfile {
        euint32 reputation;
        euint32 totalVerifications;
        euint32 successfulVerifications;
        bool isActive;
        address verifierAddress;
    }
    
    mapping(uint256 => VerificationRequest) public verificationRequests;
    mapping(address => VerifierProfile) public verifierProfiles;
    mapping(address => euint32) public userVerificationScore;
    
    uint256 public requestCounter;
    address public owner;
    
    event VerificationRequested(uint256 indexed requestId, uint256 indexed creditId, address indexed requester);
    event VerificationCompleted(uint256 indexed requestId, bool isApproved, address indexed verifier);
    event VerifierRegistered(address indexed verifier, uint32 reputation);
    event UserScoreUpdated(address indexed user, uint32 score);
    
    constructor() {
        owner = msg.sender;
    }
    
    function requestVerification(
        uint256 creditId,
        string memory verificationData
    ) public returns (uint256) {
        require(bytes(verificationData).length > 0, "Verification data cannot be empty");
        
        uint256 requestId = requestCounter++;
        
        verificationRequests[requestId] = VerificationRequest({
            requestId: FHE.asEuint32(0), // Will be set properly later
            creditId: FHE.asEuint32(0), // Will be set properly later
            verificationScore: FHE.asEuint32(0), // Will be set properly later
            isApproved: false,
            isProcessed: false,
            verificationData: verificationData,
            requester: msg.sender,
            verifier: address(0),
            timestamp: block.timestamp
        });
        
        emit VerificationRequested(requestId, creditId, msg.sender);
        return requestId;
    }
    
    function processVerification(
        uint256 requestId,
        externalEuint32 score,
        bool isApproved,
        bytes calldata inputProof
    ) public {
        require(verificationRequests[requestId].requester != address(0), "Request does not exist");
        require(!verificationRequests[requestId].isProcessed, "Request already processed");
        require(verifierProfiles[msg.sender].isActive, "Not an active verifier");
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalScore = FHE.fromExternal(score, inputProof);
        
        // Update verification request
        verificationRequests[requestId].verificationScore = internalScore;
        verificationRequests[requestId].isApproved = isApproved;
        verificationRequests[requestId].isProcessed = true;
        verificationRequests[requestId].verifier = msg.sender;
        
        // Update verifier profile
        verifierProfiles[msg.sender].totalVerifications = FHE.add(verifierProfiles[msg.sender].totalVerifications, FHE.asEuint32(1));
        
        if (isApproved) {
            verifierProfiles[msg.sender].successfulVerifications = FHE.add(verifierProfiles[msg.sender].successfulVerifications, FHE.asEuint32(1));
        }
        
        // Update user verification score
        address requester = verificationRequests[requestId].requester;
        if (isApproved) {
            userVerificationScore[requester] = FHE.add(userVerificationScore[requester], internalScore);
        } else {
            userVerificationScore[requester] = FHE.sub(userVerificationScore[requester], FHE.asEuint32(10)); // Penalty for failed verification
        }
        
        emit VerificationCompleted(requestId, isApproved, msg.sender);
        emit UserScoreUpdated(requester, 0); // FHE.decrypt(userVerificationScore[requester]) - will be decrypted off-chain
    }
    
    function registerVerifier(
        address verifierAddress,
        externalEuint32 initialReputation,
        bytes calldata inputProof
    ) public {
        require(msg.sender == owner, "Only owner can register verifiers");
        require(verifierAddress != address(0), "Invalid verifier address");
        require(!verifierProfiles[verifierAddress].isActive, "Verifier already registered");
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalReputation = FHE.fromExternal(initialReputation, inputProof);
        
        verifierProfiles[verifierAddress] = VerifierProfile({
            reputation: internalReputation,
            totalVerifications: FHE.asEuint32(0),
            successfulVerifications: FHE.asEuint32(0),
            isActive: true,
            verifierAddress: verifierAddress
        });
        
        emit VerifierRegistered(verifierAddress, 0); // FHE.decrypt(internalReputation) - will be decrypted off-chain
    }
    
    function updateVerifierReputation(
        address verifierAddress,
        externalEuint32 newReputation,
        bytes calldata inputProof
    ) public {
        require(msg.sender == owner, "Only owner can update verifier reputation");
        require(verifierProfiles[verifierAddress].isActive, "Verifier not active");
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalReputation = FHE.fromExternal(newReputation, inputProof);
        
        verifierProfiles[verifierAddress].reputation = internalReputation;
        
        emit VerifierRegistered(verifierAddress, 0); // FHE.decrypt(internalReputation) - will be decrypted off-chain
    }
    
    function getVerificationRequest(uint256 requestId) public view returns (
        uint8 score,
        bool isApproved,
        bool isProcessed,
        string memory verificationData,
        address requester,
        address verifier,
        uint256 timestamp
    ) {
        VerificationRequest storage request = verificationRequests[requestId];
        return (
            0, // FHE.decrypt(request.verificationScore) - will be decrypted off-chain
            request.isApproved,
            request.isProcessed,
            request.verificationData,
            request.requester,
            request.verifier,
            request.timestamp
        );
    }
    
    function getVerifierProfile(address verifierAddress) public view returns (
        uint8 reputation,
        uint8 totalVerifications,
        uint8 successfulVerifications,
        bool isActive
    ) {
        VerifierProfile storage profile = verifierProfiles[verifierAddress];
        return (
            0, // FHE.decrypt(profile.reputation) - will be decrypted off-chain
            0, // FHE.decrypt(profile.totalVerifications) - will be decrypted off-chain
            0, // FHE.decrypt(profile.successfulVerifications) - will be decrypted off-chain
            profile.isActive
        );
    }
    
    function getUserVerificationScore(address user) public view returns (uint8) {
        return 0; // FHE.decrypt(userVerificationScore[user]) - will be decrypted off-chain
    }
}
