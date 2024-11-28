"use client";
import React, { useState } from "react";
import Certificate from "../types/Certificate"; // Import Certificate type
import { CONFIG } from "@/config";
import { ethers } from "ethers";
import { ipfsService } from "@/utils/ipfs";
import { certificateController } from "../controllers/CertificateController";

export default function page() {
  //   const [certificateController] = useState();

  const createCertificate = async (certificate: Certificate) => {
    console.log(certificate);
    if (
      !certificate.certificateId ||
      !certificate.uniqueId ||
      !certificate.batchCode ||
      !certificate.state ||
      !certificate.price ||
      !certificate.description ||
      !certificate.productionDate
    ) {
      alert("请填写所有字段！");
      return;
    }

    try {
      const certData = certificate.toJSON();

      await certificateController.addCertificate(certData);
      alert("证书已成功添加！");
      setCertificate(new Certificate("", "", "", "", "", "", new Date(), ""));
    } catch (error) {
      console.error(error);
      alert("添加证书失败！");
    }
  };

  const fetchCertificate = async (uniqueIdForFetch: string) => {
    if (!uniqueIdForFetch) {
      alert("请输入唯一 ID！");
      return;
    }

    try {
      const record = await certificateController.getCertificate(
        uniqueIdForFetch
      );
      //   const record = await ipfsService.getJSON(records[0]);
      setRetrievedCertificate(Certificate.fromJSON(JSON.stringify(record)));
      console.log(retrievedCertificate);
      if (retrievedCertificate?.certificateId) setFetchStatus("检索成功！");
    } catch (error) {
      console.error(error);
      alert("查询证书失败！");
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
        ? new Date(value as string)
        : certificate.productionDate,
      field === "signature" ? (value as string) : certificate.signature
    );
    setCertificate(updatedCertificate);
  };

  // 提交上传 Certificate
  const handleUploadCertificate = async () => {
    try {
      setUploadStatus("上传中...");
      const ipfsHash = await createCertificate(certificate);
      setUploadStatus(`上传成功！CID: ${ipfsHash}`);
    } catch (error) {
      setUploadStatus("上传失败，请重试");
    }
  };

  // 检索 Certificate
  const handleFetchCertificate = async () => {
    try {
      setFetchStatus("正在检索...");
      await fetchCertificate(uniqueIdForFetch);
      //   setRetrievedCertificate(certificate);
      if (uniqueIdForFetch) setFetchStatus("检索成功！");
      else setFetchStatus("检索为空！");
    } catch (error) {
      setFetchStatus("检索失败，请检查 uniqueId");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          证书管理系统
        </h1>

        {/* Add Certificate Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            添加新证书
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
              type="text"
              placeholder="Certificate ID"
              value={certificate.certificateId}
              onChange={(e) =>
                handleInputChange("certificateId", e.target.value)
              }
            />
            <input
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
              type="text"
              placeholder="Unique ID"
              value={certificate.uniqueId}
              onChange={(e) => handleInputChange("uniqueId", e.target.value)}
            />
            <input
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
              type="text"
              placeholder="Batch Code"
              value={certificate.batchCode}
              onChange={(e) => handleInputChange("batchCode", e.target.value)}
            />
            <input
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
              type="text"
              placeholder="State"
              value={certificate.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
            />
            <input
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
              type="text"
              placeholder="Price"
              value={certificate.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
            />
            <input
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
              type="date"
              placeholder="Production Date"
              value={
                certificate.productionDate instanceof Date
                  ? certificate.productionDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => {
                const dateValue = e.target.value;
                handleInputChange("productionDate", dateValue);
              }}
            />
            <textarea
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 md:col-span-2"
              placeholder="Description"
              value={certificate.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
            <input
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 md:col-span-2"
              type="text"
              placeholder="Signature"
              value={certificate.signature}
              onChange={(e) => handleInputChange("signature", e.target.value)}
            />
          </div>
          <button
            onClick={handleUploadCertificate}
            className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            添加证书
          </button>
        </div>

        {/* Search Certificate Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">查询证书</h2>
          <div className="flex gap-4">
            <input
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
              type="text"
              placeholder="输入 Unique ID 查询"
              value={uniqueIdForFetch}
              onChange={(e) => setUniqueIdForFetch(e.target.value)}
            />
            <button
              onClick={() => handleFetchCertificate()}
              className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              查询
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600">{fetchStatus}</p>

          {/* Retrieved Certificate Display */}
          {retrievedCertificate && (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                      Certificate ID
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {retrievedCertificate.certificateId}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                      Unique ID
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {retrievedCertificate.uniqueId}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                      Batch Code
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {retrievedCertificate.batchCode}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                      State
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {retrievedCertificate.state}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                      Price
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {retrievedCertificate.price}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                      Description
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {retrievedCertificate.description}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                      Production Date
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {retrievedCertificate.productionDate.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                      Signature
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex justify-between items-center">
                      {retrievedCertificate.signature.slice(0, 16) + "..."}
                      <button
                        onClick={async () => {
                          try {
                            const result = await certificateController.verifyCertificate(
                              retrievedCertificate
                            );
                            alert(result ? "签名验证成功！" : "签名验证失败！");
                          } catch (error: unknown) {
                            alert("验证过程出错：" + (error instanceof Error ? error.message : String(error)));
                          }
                        }}
                        className="ml-4 bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        验证签名
                      </button>
                    </td>
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
