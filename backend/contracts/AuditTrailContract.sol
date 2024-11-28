// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AuditTrailContract {
    // 定义审计记录结构体
    struct AuditTrail {
        string actorId;      // 操作人 ID
        string uniqueId;     // 唯一标识（如产品或操作的唯一 ID）
        string batchCode;    // 批次号
        string role;         // 操作人角色
        uint256 timestamp;   // 操作发生的时间戳
    }

    // 存储所有的审计记录，按 uniqueId 分组
    mapping(string => AuditTrail[]) private auditTrails;

    // 事件：当新增审计记录时触发
    event AuditRecorded(
        string indexed uniqueId,
        string actorId,
        string batchCode,
        string role,
        uint256 timestamp
    );

    // 新增审计记录
    function addAuditTrail(
        string memory actorId,
        string memory uniqueId,
        string memory batchCode,
        string memory role
    ) public {
        // 创建新的审计记录
        AuditTrail memory newAudit = AuditTrail({
            actorId: actorId,
            uniqueId: uniqueId,
            batchCode: batchCode,
            role: role,
            timestamp: block.timestamp // 使用当前区块时间戳
        });

        // 将新记录添加到对应 uniqueId 的数组中
        auditTrails[uniqueId].push(newAudit);

        // 触发事件
        emit AuditRecorded(uniqueId, actorId, batchCode, role, block.timestamp);
    }

    // 获取某个 uniqueId 的所有审计记录
    function getAuditTrails(string memory uniqueId) public view returns (AuditTrail[] memory) {
        return auditTrails[uniqueId];
    }

    // 获取某个 uniqueId 的最新审计记录
    function getLatestAuditTrail(string memory uniqueId) public view returns (AuditTrail memory) {
        uint256 length = auditTrails[uniqueId].length;
        require(length > 0, "No audit trails found for this uniqueId");
        return auditTrails[uniqueId][length - 1];
    }
}
