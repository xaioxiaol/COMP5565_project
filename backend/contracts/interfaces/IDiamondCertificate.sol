// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IDiamondCertificate {
    enum CertificateStatus {
        Created,
        Mined,
        Cut,
        Certified,
        Manufactured,
        Sold
    }

    event CertificateCreated(uint256 indexed id, string ipfsHash);
    event StatusUpdated(uint256 indexed id, CertificateStatus status);
    event CertificateTransferred(uint256 indexed id, address from, address to);
    event RoleGranted(bytes32 indexed role, address indexed account);
    event RoleRevoked(bytes32 indexed role, address indexed account);

    function createCertificate(string memory ipfsHash) external returns (uint256);
    function updateStatus(uint256 certificateId, CertificateStatus newStatus, string memory newIpfsHash) external;
    function transferCertificate(uint256 certificateId, address to) external;
    function getCertificateDetails(uint256 certificateId) external view returns (
        address currentOwner,
        string memory ipfsHash,
        CertificateStatus status,
        bool isTransferable
    );
    function getCertificateHistory(uint256 certificateId) external view returns (
        uint256[] memory timestamps,
        address[] memory operators,
        CertificateStatus[] memory statuses,
        string[] memory ipfsHashes
    );
} 