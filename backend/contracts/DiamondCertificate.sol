// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IDiamondCertificate.sol";
import "./access/RoleManager.sol";
import "./storage/CertificateStorage.sol";

contract DiamondCertificate is IDiamondCertificate, RoleManager, CertificateStorage {
    constructor() RoleManager() {
        _nextCertificateId = 1;
    }

    function createCertificate(string memory ipfsHash) external override whenNotPaused returns (uint256) {
        require(hasRole(MANUFACTURER_ROLE, msg.sender), "Only manufacturer can create");
        
        uint256 newId = _nextCertificateId++;
        Certificate storage cert = _certificates[newId];
        cert.id = newId;
        cert.currentOwner = msg.sender;
        cert.ipfsHash = ipfsHash;
        cert.status = CertificateStatus.Created;
        cert.statusSignatures[uint(CertificateStatus.Created)] = msg.sender;
        cert.isTransferable = false;

        _addToHistory(newId, msg.sender, CertificateStatus.Created, ipfsHash);
        emit CertificateCreated(newId, ipfsHash);
        return newId;
    }

    function updateStatus(
        uint256 certificateId, 
        CertificateStatus newStatus, 
        string memory newIpfsHash
    ) external override whenNotPaused {
        Certificate storage cert = _certificates[certificateId];
        require(cert.id != 0, "Certificate does not exist");
        require(uint(newStatus) == uint(cert.status) + 1, "Invalid status transition");
        require(_canUpdateStatus(msg.sender, newStatus), "Unauthorized");
        
        cert.status = newStatus;
        cert.ipfsHash = newIpfsHash;
        cert.statusSignatures[uint(newStatus)] = msg.sender;
        
        _addToHistory(certificateId, msg.sender, newStatus, newIpfsHash);
        
        if (newStatus == CertificateStatus.Sold) {
            cert.isTransferable = true;
        }
        
        emit StatusUpdated(certificateId, newStatus);
    }

    function transferCertificate(uint256 certificateId, address to) external override whenNotPaused {
        Certificate storage cert = _certificates[certificateId];
        require(cert.currentOwner == msg.sender, "Not the owner");
        require(cert.isTransferable, "Certificate not transferable");
        require(to != address(0), "Invalid recipient");

        cert.currentOwner = to;
        emit CertificateTransferred(certificateId, msg.sender, to);
    }

    function getCertificateDetails(uint256 certificateId) 
        external 
        view 
        override
        returns (
            address currentOwner,
            string memory ipfsHash,
            CertificateStatus status,
            bool isTransferable
        ) 
    {
        Certificate storage cert = _certificates[certificateId];
        require(cert.id != 0, "Certificate does not exist");
        
        return (
            cert.currentOwner,
            cert.ipfsHash,
            cert.status,
            cert.isTransferable
        );
    }

    // 暂停和恢复功能
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function getCertificateHistory(uint256 certificateId) 
        external 
        view 
        override
        returns (
            uint256[] memory timestamps,
            address[] memory operators,
            CertificateStatus[] memory statuses,
            string[] memory ipfsHashes
        ) 
    {
        StatusHistory[] storage history = _certificateHistory[certificateId];
        uint256 length = history.length;
        
        timestamps = new uint256[](length);
        operators = new address[](length);
        statuses = new CertificateStatus[](length);
        ipfsHashes = new string[](length);
        
        for (uint256 i = 0; i < length; i++) {
            timestamps[i] = history[i].timestamp;
            operators[i] = history[i].operator;
            statuses[i] = history[i].status;
            ipfsHashes[i] = history[i].ipfsHash;
        }
        
        return (timestamps, operators, statuses, ipfsHashes);
    }
} 