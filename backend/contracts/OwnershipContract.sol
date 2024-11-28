// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OwnershipContract {
    // uniqueId => list of IPFS hashes
    mapping(string => string[]) private ownerships;

    // 添加审计记录
    function addOwnership(string memory uniqueId, string memory ipfsHash) public {
        ownerships[uniqueId].push(ipfsHash);
    }

    // 获取审计记录
    function getOwnerships(string memory uniqueId) public view returns (string[] memory) {
        return ownerships[uniqueId];
    }
}
