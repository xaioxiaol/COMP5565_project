// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IDiamondCertificate.sol";

contract RoleManager is Ownable {
    mapping(bytes32 => mapping(address => bool)) public roles;

    bytes32 public constant MINER_ROLE = keccak256("MINER_ROLE");
    bytes32 public constant CUTTER_ROLE = keccak256("CUTTER_ROLE");
    bytes32 public constant CERTIFIER_ROLE = keccak256("CERTIFIER_ROLE");
    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");

    constructor() Ownable() {
        _setupInitialRoles();
    }

    function _setupInitialRoles() private {
        address deployer = msg.sender;
        roles[MINER_ROLE][deployer] = true;
        roles[CUTTER_ROLE][deployer] = true;
        roles[CERTIFIER_ROLE][deployer] = true;
        roles[MANUFACTURER_ROLE][deployer] = true;
    }

    function grantRole(bytes32 role, address account) external onlyOwner {
        roles[role][account] = true;
    }

    function revokeRole(bytes32 role, address account) external onlyOwner {
        roles[role][account] = false;
    }

    function hasRole(bytes32 role, address account) public view returns (bool) {
        return roles[role][account];
    }

    function _canUpdateStatus(address account, IDiamondCertificate.CertificateStatus status) 
        internal 
        view 
        returns (bool) 
    {
        if (status == IDiamondCertificate.CertificateStatus.Mined) {
            return hasRole(MINER_ROLE, account);
        } else if (status == IDiamondCertificate.CertificateStatus.Cut) {
            return hasRole(CUTTER_ROLE, account);
        } else if (status == IDiamondCertificate.CertificateStatus.Certified) {
            return hasRole(CERTIFIER_ROLE, account);
        } else if (status == IDiamondCertificate.CertificateStatus.Manufactured) {
            return hasRole(MANUFACTURER_ROLE, account);
        }
        return false;
    }
} 