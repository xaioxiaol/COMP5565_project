// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../interfaces/IDiamondCertificate.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CertificateStorage is Pausable {
    struct Certificate {
        uint256 id;
        address currentOwner;
        string ipfsHash;
        IDiamondCertificate.CertificateStatus status;
        mapping(uint => address) statusSignatures;
        bool isTransferable;
    }

    struct StatusHistory {
        uint256 timestamp;
        address operator;
        IDiamondCertificate.CertificateStatus status;
        string ipfsHash;
    }

    mapping(uint256 => Certificate) internal _certificates;
    mapping(uint256 => StatusHistory[]) internal _certificateHistory;
    uint256 internal _nextCertificateId;

    function _addToHistory(
        uint256 certificateId,
        address operator,
        IDiamondCertificate.CertificateStatus status,
        string memory ipfsHash
    ) internal {
        _certificateHistory[certificateId].push(StatusHistory({
            timestamp: block.timestamp,
            operator: operator,
            status: status,
            ipfsHash: ipfsHash
        }));
    }
} 