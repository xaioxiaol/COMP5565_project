// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateContract {
    // uniqueId => list of IPFS hashes
    mapping(string => string[]) private certificates;

    // 添加审计记录
    function addCertificate(string memory uniqueId, string memory ipfsHash) public {
        certificates[uniqueId].push(ipfsHash);
    }

    // 获取审计记录
    function getCertificates(string memory uniqueId) public view returns (string[] memory) {
        return certificates[uniqueId];
    }
}
