"use client";
import React, { useState } from "react";
import Certificate from "../types/certificate"; // Import Certificate type
import { CONFIG } from "@/config";
import { ethers } from "ethers";
import { ipfsService } from "@/utils/ipfs";

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
  async function addCertificateInContract(uniqueId: string, ipfsHash: string) {
    try {
      const contract = await getContract(); // 获取合约实例

      // 调用合约的 addAuditRecord 方法
      const tx = await contract.addCertificate(uniqueId, ipfsHash);
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
  async function getCertificateInContract(uniqueId: string) {
    try {
      const contract = await getContract(); // 获取合约实例
      const records = await contract.getCertificates(uniqueId);
      return records;
    } catch (error) {
      console.error("添加审计记录失败:", error);
      throw error;
    }
  }

  const addCertificate = async (certificate: Certificate) => {
    if (
      !certificate.certificateId ||
      !certificate.uniqueId ||
      !certificate.batchCode ||
      !certificate.state ||
      !certificate.price ||
      !certificate.description ||
      !certificate.productionDate ||
      !certificate.signature
    ) {
      alert("请填写所有字段！");
      return;
    }

    try {
      const auditData = {
        certificateId: certificate.certificateId,
        uniqueId: certificate.uniqueId,
        batchCode: certificate.batchCode,
        state: certificate.state,
        price: certificate.price,
        description: certificate.description,
        productionDate: certificate.productionDate,
        signature: certificate.signature,
        timestamp: new Date().toISOString(),
      };

      // 上传数据到 IPFS
      const ipfsHash = await ipfsService.uploadJSON(auditData);

      await addCertificateInContract(uniqueIdForFetch, ipfsHash);
      alert("审计记录已成功添加到 IPFS！");
      setCertificate(new Certificate("", "", "", "", "", "", new Date(), "")); // 清空字段
    } catch (error) {
      console.error(error);
      alert("添加审计记录到 IPFS 失败！");
    }
  };

  // 查询审计记录
  const fetchCertificate = async (uniqueIdForFetch: string) => {
    if (!uniqueIdForFetch) {
      alert("请输入唯一 ID！");
      return;
    }

    try {
      const records = await getCertificateInContract(uniqueIdForFetch);
      const record = await ipfsService.getJSON(records[0]);
      setRetrievedCertificate(Certificate.fromJSON(JSON.parse(record)));
      setFetchStatus("检索成功！");
    } catch (error) {
      console.error(error);
      alert("查询审计记录失败！");
    }
  };

  // Certificate 实例，用于实时存储输入
  const [certificate, setCertificate] = useState<Certificate>(
    new Certificate("", "", "", "", "", "", new Date(), "")
  );

  // 用户输入的 uniqueId，用于检索
  const [uniqueIdForFetch, setUniqueIdForFetch] = useState("");
  const [retrievedCertificate, setRetrievedCertificate] =
    useState<Certificate | null>(null);

  // 上传状态
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [fetchStatus, setFetchStatus] = useState<string>("");

  // 表单输入处理：动态更新 Certificate
  const handleInputChange = (
    field: keyof Certificate,
    value: string | number
  ) => {
    const updatedCertificate = new Certificate(
      field === "certificateId" ? (value as string) : certificate.certificateId,
      field === "uniqueId" ? (value as string) : certificate.uniqueId,
      field === "batchCode" ? (value as string) : certificate.batchCode,
      field === "state" ? (value as string) : certificate.state,
      field === "price" ? (value as string) : certificate.price,
      field === "description" ? (value as string) : certificate.description,
      field === "productionDate"
        ? (value as unknown as Date)
        : certificate.productionDate,
      field === "signature" ? (value as string) : certificate.signature
    );
    setCertificate(updatedCertificate);
  };

  // 提交上传 Certificate
  const handleUploadCertificate = async () => {
    try {
      setUploadStatus("上传中...");
      const cid = await addCertificate(certificate);
      setUploadStatus(`上传成功！CID: ${cid}`);
    } catch (error) {
      setUploadStatus("上传失败，请重试");
    }
  };

  // 检索 Certificate
  const handleFetchCertificate = async () => {
    try {
      setFetchStatus("正在检索...");
      await fetchCertificate(uniqueIdForFetch);
      setFetchStatus("检索成功！");
    } catch (error) {
      setFetchStatus("检索失败，请检查 uniqueId");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Certificate Management System
        </h1>

        {/* Create Certificate Form */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Create Certificate
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="input-field"
              type="text"
              placeholder="Certificate ID"
              value={certificate.certificateId}
              onChange={(e) =>
                handleInputChange("certificateId", e.target.value)
              }
            />
            <input
              className="input-field"
              type="text"
              placeholder="Unique ID"
              value={certificate.uniqueId}
              onChange={(e) => handleInputChange("uniqueId", e.target.value)}
            />
            <input
              className="input-field"
              type="text"
              placeholder="Batch Code"
              value={certificate.batchCode}
              onChange={(e) => handleInputChange("batchCode", e.target.value)}
            />
            <input
              className="input-field"
              type="text"
              placeholder="State"
              value={certificate.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
            />
            <input
              className="input-field"
              type="text"
              placeholder="Price"
              value={certificate.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
            />
            <input
              className="input-field"
              type="text"
              placeholder="Description"
              value={certificate.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
            <input
              className="input-field"
              type="date"
              placeholder="Production Date"
              value={
                new Date(certificate.productionDate).toISOString().split("T")[0]
              }
              onChange={(e) =>
                handleInputChange(
                  "productionDate",
                  new Date(e.target.value).getTime()
                )
              }
            />
            <input
              className="input-field"
              type="text"
              placeholder="Signature"
              value={certificate.signature}
              onChange={(e) => handleInputChange("signature", e.target.value)}
            />
          </div>
          <button
            onClick={handleUploadCertificate}
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Upload Certificate
          </button>
          <p
            className={`mt-2 text-center ${
              uploadStatus.includes("成功") ? "text-green-600" : "text-red-600"
            }`}
          >
            {uploadStatus}
          </p>
        </div>

        {/* Retrieve Certificate Section */}
        <div className="border-t pt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Retrieve Certificate
          </h2>
          <div className="flex gap-4">
            <input
              className="input-field flex-1"
              type="text"
              placeholder="Enter Unique ID"
              value={uniqueIdForFetch}
              onChange={(e) => setUniqueIdForFetch(e.target.value)}
            />
            <button
              onClick={handleFetchCertificate}
              className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition duration-200"
            >
              Retrieve
            </button>
          </div>
          <p
            className={`mt-2 text-center ${
              fetchStatus.includes("成功") ? "text-green-600" : "text-red-600"
            }`}
          >
            {fetchStatus}
          </p>

          {retrievedCertificate && (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full bg-white border rounded-lg">
                <tbody>
                  <tr className="border-b">
                    <td className="px-6 py-3 bg-gray-50 font-medium">Certificate ID</td>
                    <td className="px-6 py-3">{retrievedCertificate.certificateId}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-3 bg-gray-50 font-medium">Unique ID</td>
                    <td className="px-6 py-3">{retrievedCertificate.uniqueId}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-3 bg-gray-50 font-medium">Batch Code</td>
                    <td className="px-6 py-3">{retrievedCertificate.batchCode}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-3 bg-gray-50 font-medium">State</td>
                    <td className="px-6 py-3">{retrievedCertificate.state}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-3 bg-gray-50 font-medium">Price</td>
                    <td className="px-6 py-3">{retrievedCertificate.price}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-3 bg-gray-50 font-medium">Description</td>
                    <td className="px-6 py-3">{retrievedCertificate.description}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-3 bg-gray-50 font-medium">Production Date</td>
                    <td className="px-6 py-3">
                      {retrievedCertificate.productionDate.toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 bg-gray-50 font-medium">Signature</td>
                    <td className="px-6 py-3">{retrievedCertificate.signature}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
