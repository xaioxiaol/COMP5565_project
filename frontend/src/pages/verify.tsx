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
      alert("Please fill in all fields!");
      return;
    }

    try {
      const certData = certificate.toJSON();

      await certificateController.addCertificate(certData);
      alert("Certificate added successfully!");
      setCertificate(new Certificate("", "", "", "", "", "", new Date(), ""));
    } catch (error) {
      console.error(error);
      alert("Failed to add certificate!");
    }
  };

  const fetchCertificate = async (uniqueIdForFetch: string) => {
    if (!uniqueIdForFetch) {
      alert("Please enter Unique ID!");
      return;
    }

    try {
      const record = await certificateController.getCertificate(
        uniqueIdForFetch
      );
      //   const record = await ipfsService.getJSON(records[0]);
      setRetrievedCertificate(Certificate.fromJSON(JSON.stringify(record)));
      console.log(retrievedCertificate);
      if (retrievedCertificate?.certificateId)
        setFetchStatus("Retrieved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to query certificate!");
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
      setUploadStatus("Uploading...");
      const ipfsHash = await createCertificate(certificate);
      setUploadStatus(`Upload successful! CID: ${ipfsHash}`);
    } catch (error) {
      setUploadStatus("Upload failed, please try again");
    }
  };

  // 检索 Certificate
  const handleFetchCertificate = async () => {
    try {
      setFetchStatus("Searching...");
      await fetchCertificate(uniqueIdForFetch);
      //   setRetrievedCertificate(certificate);
      if (uniqueIdForFetch) setFetchStatus("Retrieved successfully!");
      else setFetchStatus("Retrieved empty!");
    } catch (error) {
      setFetchStatus("Search failed, please check uniqueId");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-center mb-8">
          Certificate Verification Program
        </h1>

        {/* Search Certificate Section */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-purple-500/20 shadow-2xl rounded-lg p-6">
          <h2 className="text-xl font-semibold text-purple-400 mb-6">
            Search Certificate
          </h2>
          <div className="flex gap-4">
            <input
              className="flex-1 rounded-md bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 
                       shadow-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-2"
              type="text"
              placeholder="Enter Unique ID to search"
              value={uniqueIdForFetch}
              onChange={(e) => setUniqueIdForFetch(e.target.value)}
            />
            <button
              onClick={() => handleFetchCertificate()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-6 rounded-md 
                       hover:from-purple-700 hover:to-pink-700 transition-all duration-300 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                       focus:ring-offset-gray-900"
            >
              Search
            </button>
          </div>
          <p className="mt-2 text-sm text-purple-300">{fetchStatus}</p>

          {/* Retrieved Certificate Display */}
          {retrievedCertificate && (
            <div className="max-w-3xl mx-auto p-8">
              <div className="transform transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-lg shadow-2xl relative border border-purple-500/20">
                  {/* 装饰性边角改用霓虹风格 */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-purple-500/50 -translate-x-2 -translate-y-2"></div>
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-purple-500/50 translate-x-2 -translate-y-2"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-purple-500/50 -translate-x-2 translate-y-2"></div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-purple-500/50 translate-x-2 translate-y-2"></div>

                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Digital Certificate
                    </h1>
                    <div className="w-32 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-2"></div>
                  </div>

                  <div className="space-y-6">
                    {/* 证书内容行样式更新 */}
                    <div className="certificate-row flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-purple-400 font-medium">Certificate ID:</span>
                      <span className="text-gray-300">{retrievedCertificate.certificateId}</span>
                    </div>

                    <div className="certificate-row flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-purple-400 font-medium">Unique ID:</span>
                      <span className="text-gray-300">{retrievedCertificate.uniqueId}</span>
                    </div>

                    <div className="certificate-row flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-purple-400 font-medium">Batch Code:</span>
                      <span className="text-gray-300">{retrievedCertificate.batchCode}</span>
                    </div>

                    <div className="certificate-row flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-purple-400 font-medium">State:</span>
                      <span className="text-gray-300">{retrievedCertificate.state}</span>
                    </div>

                    <div className="certificate-row flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-purple-400 font-medium">Price:</span>
                      <span className="text-gray-300">{retrievedCertificate.price}</span>
                    </div>

                    <div className="certificate-row flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-purple-400 font-medium">Description:</span>
                      <span className="text-gray-300">{retrievedCertificate.description}</span>
                    </div>

                    <div className="certificate-row flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-purple-400 font-medium">Production Date:</span>
                      <span className="text-gray-300">{retrievedCertificate.productionDate.toLocaleString()}</span>
                    </div>

                    {/* 验证签名按钮改用现代风格 */}
                    <div className="certificate-row flex items-center gap-4">
                      <span className="text-purple-400 font-medium">Signature:</span>
                      <button
                        onClick={async () => {
                          try {
                            const result =
                              await certificateController.verifyCertificate(
                                retrievedCertificate
                              );
                            alert(
                              result
                                ? "Signature verification successful!"
                                : "Signature verification failed!"
                            );
                          } catch (error: unknown) {
                            alert(
                              "Verification error: " +
                                (error instanceof Error
                                  ? error.message
                                  : String(error))
                            );
                          }
                        }}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-md 
                          hover:from-purple-700 hover:to-pink-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                      >
                        Verify Signature
                        <span className="text-sm opacity-80">
                          {retrievedCertificate.signature.slice(0, 16) + "..."}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 添加装饰性背景元素 */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
      </div>
    </div>
  );
}
