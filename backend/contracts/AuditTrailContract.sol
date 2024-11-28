// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AuditTrailContract {
    // uniqueId => list of IPFS hashes
    mapping(string => string[]) private auditRecords;

    // 添加审计记录
    function addAuditRecord(string memory uniqueId, string memory ipfsHash) public {
        auditRecords[uniqueId].push(ipfsHash);
    }

    // 获取审计记录
    function getAuditRecords(string memory uniqueId) public view returns (string[] memory) {
        return auditRecords[uniqueId];
    }
}
