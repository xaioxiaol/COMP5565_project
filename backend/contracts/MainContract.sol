// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CertificateContract.sol";
import "./AuditTrailContract.sol";
import "./OwnershipContract.sol";

contract MainContract is
    CertificateContract,
    AuditTrailContract,
    OwnershipContract
{
    
}
