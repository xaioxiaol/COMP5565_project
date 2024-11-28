# 1. 审计记录合约部署

## 1.1 定义合约内容（变量和数据类型）

```solidiy
struct AuditTrail {
    string actorId;
    string uniqueId;
    string batchCode;
    string role;
    uint256 timestamp;
}
```
告诉chatgpt，按照这个数据结构生成一个合约，并部署到本地。

它会返回一个完整的合约

```solidiy
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
```

## 1.2 部署合约

先创建一个部署合约的ts文件：

```typescript
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const MainContract = await ethers.getContractFactory("AuditTrailContract");
  const contract = await MainContract.deploy();

  const deployTx = contract.deploymentTransaction();
  if (!deployTx) throw new Error("Deployment transaction failed");
  
  console.log("Deploy transaction hash:", deployTx.hash);

  // 等待区块确认部署
  const receipt = await deployTx.wait();
  console.log("Contract deployed at:", await contract.getAddress());
  console.log("Transaction receipt:", receipt);
}

main().catch((err) => console.error(err));
```

打开hardhat 项目，然后运行：

```bash
npx hardhat node
```

然后运行：

```bash
npx hardhat run scripts/deploy.js --network localhost
```

## 1.3 加入交互前端

告诉gpt，按照这个合约，生成一个交互的前端：“生成一个前端next。js的交互界面”

```typescript
import { useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  // 定义状态变量
  const [contractAddress, setContractAddress] = useState(""); // 合约地址
  const [actorId, setActorId] = useState(""); // 操作人 ID
  const [uniqueId, setUniqueId] = useState(""); // 唯一标识
  const [batchCode, setBatchCode] = useState(""); // 批次号
  const [role, setRole] = useState(""); // 角色
  const [audits, setAudits] = useState([]); // 存储查询的审计记录
  const [queryUniqueId, setQueryUniqueId] = useState(""); // 查询用的唯一 ID

  // 合约 ABI (替换为你的 AuditTrailContract ABI)
  const contractAbi = [
    {
      "inputs": [
        { "internalType": "string", "name": "actorId", "type": "string" },
        { "internalType": "string", "name": "uniqueId", "type": "string" },
        { "internalType": "string", "name": "batchCode", "type": "string" },
        { "internalType": "string", "name": "role", "type": "string" }
      ],
      "name": "addAuditTrail",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "string", "name": "uniqueId", "type": "string" }],
      "name": "getAuditTrails",
      "outputs": [
        {
          "components": [
            { "internalType": "string", "name": "actorId", "type": "string" },
            { "internalType": "string", "name": "uniqueId", "type": "string" },
            { "internalType": "string", "name": "batchCode", "type": "string" },
            { "internalType": "string", "name": "role", "type": "string" },
            { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
          ],
          "internalType": "struct AuditTrailContract.AuditTrail[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // 添加审计记录
  const addAuditRecord = async () => {
    if (!contractAddress || !actorId || !uniqueId || !batchCode || !role) {
      alert("请填写所有字段！");
      return;
    }

    try {
      // 初始化 ethers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);

      // 调用合约方法
      const tx = await contract.addAuditTrail(actorId, uniqueId, batchCode, role);
      await tx.wait(); // 等待交易被矿工确认

      alert("审计记录已成功添加！");
      setActorId(""); setUniqueId(""); setBatchCode(""); setRole(""); // 清空字段
    } catch (error) {
      console.error(error);
      alert("添加审计记录失败！");
    }
  };

  // 查询审计记录
  const fetchAuditRecords = async () => {
    if (!contractAddress || !queryUniqueId) {
      alert("请输入合约地址和唯一 ID！");
      return;
    }

    try {
      // 初始化 ethers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractAbi, provider);

      // 查询审计记录
      const records = await contract.getAuditTrails(queryUniqueId);
      setAudits(records); // 将查询结果存入状态变量
    } catch (error) {
      console.error(error);
      alert("查询审计记录失败！");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Audit Trail 管理系统</h1>

      {/* 合约地址输入 */}
      <div>
        <label>智能合约地址：</label>
        <input
          type="text"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          placeholder="输入智能合约地址"
          style={{ width: "300px", margin: "10px" }}
        />
      </div>

      <hr />

      {/* 添加审计记录 */}
      <h2>添加审计记录</h2>
      <div>
        <input
          type="text"
          value={actorId}
          onChange={(e) => setActorId(e.target.value)}
          placeholder="操作人 ID"
          style={{ width: "200px", margin: "5px" }}
        />
        <input
          type="text"
          value={uniqueId}
          onChange={(e) => setUniqueId(e.target.value)}
          placeholder="唯一标识 (uniqueId)"
          style={{ width: "200px", margin: "5px" }}
        />
        <input
          type="text"
          value={batchCode}
          onChange={(e) => setBatchCode(e.target.value)}
          placeholder="批次号"
          style={{ width: "200px", margin: "5px" }}
        />
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="角色"
          style={{ width: "200px", margin: "5px" }}
        />
        <button onClick={addAuditRecord} style={{ margin: "10px" }}>
          添加审计记录
        </button>
      </div>

      <hr />

      {/* 查询审计记录 */}
      <h2>查询审计记录</h2>
      <div>
        <input
          type="text"
          value={queryUniqueId}
          onChange={(e) => setQueryUniqueId(e.target.value)}
          placeholder="输入唯一标识 (uniqueId)"
          style={{ width: "300px", margin: "10px" }}
        />
        <button onClick={fetchAuditRecords} style={{ margin: "5px" }}>
          查询记录
        </button>
      </div>

      {/* 显示审计记录 */}
      <h3>查询结果：</h3>
      {audits.length === 0 ? (
        <p>无审计记录</p>
      ) : (
        <table border="1" style={{ width: "100%", marginTop: "10px" }}>
          <thead>
            <tr>
              <th>Actor ID</th>
              <th>Unique ID</th>
              <th>Batch Code</th>
              <th>Role</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {audits.map((audit, index) => (
              <tr key={index}>
                <td>{audit.actorId}</td>
                <td>{audit.uniqueId}</td>
                <td>{audit.batchCode}</td>
                <td>{audit.role}</td>
                <td>{new Date(audit.timestamp * 1000).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

然后运行

```bash
npm run dev
```

