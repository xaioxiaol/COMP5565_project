import { CONFIG } from "@/config";
import { ipfsService } from "@/utils/ipfs";
import { ethers } from "ethers";
import { useState } from "react";

interface AuditRecord {
  actorId: string;
  uniqueId: string;
  batchCode: string;
  role: string;
  timestamp: string;
}

export default function page() {
  const contractAddress = CONFIG.CONTRACT_ADDRESS;
  const abi = [
    {
      inputs: [
        {
          internalType: "string",
          name: "uniqueId",
          type: "string",
        },
        {
          internalType: "string",
          name: "ipfsHash",
          type: "string",
        },
      ],
      name: "addAuditRecord",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "uniqueId",
          type: "string",
        },
        {
          internalType: "string",
          name: "ipfsHash",
          type: "string",
        },
      ],
      name: "addCertificate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "uniqueId",
          type: "string",
        },
        {
          internalType: "string",
          name: "ipfsHash",
          type: "string",
        },
      ],
      name: "addOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "uniqueId",
          type: "string",
        },
      ],
      name: "getAuditRecords",
      outputs: [
        {
          internalType: "string[]",
          name: "",
          type: "string[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "uniqueId",
          type: "string",
        },
      ],
      name: "getCertificates",
      outputs: [
        {
          internalType: "string[]",
          name: "",
          type: "string[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "uniqueId",
          type: "string",
        },
      ],
      name: "getOwnerships",
      outputs: [
        {
          internalType: "string[]",
          name: "",
          type: "string[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
  // 定义状态变量
  const [actorId, setActorId] = useState(""); // 操作人 ID
  const [uniqueId, setUniqueId] = useState(""); // 唯一标识
  const [batchCode, setBatchCode] = useState(""); // 批次号
  const [role, setRole] = useState(""); // 角色
  const [audit, setAudit] = useState<AuditRecord>(); // 存储查询的审计记录
  const [queryUniqueId, setQueryUniqueId] = useState(""); // 查询用的唯一 ID

  async function getContract() {
    // 检查是否安装了 MetaMask 或其他支持的以太坊钱包
    if (!window.ethereum) {
      throw new Error("MetaMask 未安装，请安装后重试！");
    }

    // 连接 MetaMask 并获取钱包地址
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // 创建合约对象
    const contract = new ethers.Contract(contractAddress, abi, signer);
    return contract;
  }

  // 向智能合约添加审计记录
  async function addAuditRecordInContract(uniqueId: string, ipfsHash: string) {
    try {
      const contract = await getContract(); // 获取合约实例

      // 调用合约的 addAuditRecord 方法
      const tx = await contract.addAuditRecord(uniqueId, ipfsHash);
      console.log("正在提交交易，请稍后...", tx.hash);

      // 等待交易完成，链上确认
      await tx.wait();
      console.log("交易完成，已成功添加审计记录！", tx.hash);
    } catch (error) {
      console.error("添加审计记录失败:", error);
      throw error;
    }
  }

  // 向智能合约检索审计记录
  async function getAuditRecordInContract(uniqueId: string) {
    try {
      const contract = await getContract(); // 获取合约实例
      const records = await contract.getAuditRecords(uniqueId);
      return records;
    } catch (error) {
      console.error("添加审计记录失败:", error);
      throw error;
    }
  }

  // 添加审计记录
  const addAuditRecord = async () => {
    if (!actorId || !uniqueId || !batchCode || !role) {
      alert("请填写所有字段！");
      return;
    }

    try {
      const auditData = {
        actorId,
        uniqueId,
        batchCode,
        role,
        timestamp: new Date().toISOString(),
      };

      // 上传数据到 IPFS
      const ipfsHash = await ipfsService.uploadJSON(auditData);

      await addAuditRecordInContract(uniqueId, ipfsHash);

      alert("审计记录已成功添加到 IPFS！");
      setActorId("");
      setUniqueId("");
      setBatchCode("");
      setRole(""); // 清空字段
    } catch (error) {
      console.error(error);
      alert("添加审计记录到 IPFS 失败！");
    }
  };

  // 查询审计记录
  const fetchAuditRecords = async () => {
    if (!queryUniqueId) {
      alert("请输入唯一 ID！");
      return;
    }

    try {
      const records = await getAuditRecordInContract(queryUniqueId);
      console.log(records);
      const record = await ipfsService.getJSON(records[0]);

      console.log(record);
      setAudit(JSON.parse(record));
    } catch (error) {
      console.error(error);
      alert("查询审计记录失败！");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Audit Trail 管理系统 (IPFS)</h1>

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
          添加审计记录到 IPFS
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
      {!audit ? (
        <p>无审计记录</p>
      ) : (
        <table style={{ width: "100%", marginTop: "10px" }}>
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
            <tr>
              <td>{audit.actorId}</td>
              <td>{audit.uniqueId}</td>
              <td>{audit.batchCode}</td>
              <td>{audit.role}</td>
              <td>{audit.timestamp}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
