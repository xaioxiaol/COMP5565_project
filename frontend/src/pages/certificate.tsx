"use client";
import React, { useState } from "react";
import Certificate from "../types/Certificate"; // Import Certificate type
import { CONFIG } from "@/config";
import { ethers } from "ethers";
import { ipfsService } from "@/utils/ipfs";
import { certificateController } from "../controllers/CertificateController";

export default function page() {
  const [certificate, setCertificate] = useState<Certificate>(
    new Certificate("", "", "", "", "", "", new Date(), "")
  );
  const [uniqueIdForFetch, setUniqueIdForFetch] = useState("");
  const [retrievedCertificate, setRetrievedCertificate] = useState<Certificate | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [fetchStatus, setFetchStatus] = useState<string>("");

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
      if (retrievedCertificate?.certificateId) setFetchStatus("Retrieved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to query certificate!");
    }
  };

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
    <div className="min-h-screen bg-[#0c0c1d] bg-opacity-95 relative overflow-hidden">
      {/* 动态背景网格 */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      {/* 动态光晕效果 */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" />
      <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow delay-75" />
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow delay-150" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* 标题部分 */}
        <div className="text-center mb-12 relative">
          <div className="inline-block">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 animate-gradient-x mb-4">
              Certificate Management System
            </h1>
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse-slow" />
          </div>
          <p className="mt-4 text-gray-300 text-lg">
            Create and manage your diamond certificates with blockchain security
          </p>
        </div>

        {/* 添加证书表单 */}
        <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-8 mb-8 
          border border-gray-700/50 hover:border-purple-500/50
          transform transition-all duration-500 hover:scale-[1.01]
          relative overflow-hidden group">
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          
          <div className="relative">
            <div className="flex items-center mb-8">
              <div className="p-3 bg-purple-500/10 rounded-xl mr-4">
                <span className="text-2xl">📜</span>
              </div>
              <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Add New Certificate
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { field: "certificateId", label: "Certificate ID", type: "text" },
                { field: "uniqueId", label: "Unique ID", type: "text" },
                { field: "batchCode", label: "Batch Code", type: "text" },
                { field: "state", label: "State", type: "text" },
                { field: "price", label: "Price", type: "text" },
                { field: "productionDate", label: "Production Date", type: "date" }
              ].map(({ field, label, type }) => (
                <div key={field} className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">{label}</label>
                  <input
                    type={type}
                    value={type === "date" && certificate[field as keyof Certificate] instanceof Date 
                      ? (certificate[field as keyof Certificate] as Date).toISOString().split("T")[0] 
                      : String(certificate[field as keyof Certificate])}
                    onChange={(e) => handleInputChange(field as keyof Certificate, e.target.value)}
                    className="w-full rounded-xl bg-gray-800/50 border border-gray-700/50 
                      text-gray-300 placeholder-gray-500 
                      focus:border-purple-500 focus:ring-purple-500/20 
                      transition-all duration-300 px-4 py-3
                      hover:border-purple-500/50"
                    placeholder={label}
                  />
                </div>
              ))}

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-300">Description</label>
                <textarea
                  value={certificate.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="w-full rounded-xl bg-gray-800/50 border border-gray-700/50 
                    text-gray-300 placeholder-gray-500 
                    focus:border-purple-500 focus:ring-purple-500/20 
                    transition-all duration-300 px-4 py-3
                    hover:border-purple-500/50"
                  placeholder="Description"
                  rows={4}
                />
              </div>
            </div>

            <button
              onClick={handleUploadCertificate}
              className="mt-8 w-full bg-gradient-to-r from-purple-500 to-pink-500 
                text-white font-medium rounded-xl py-3 px-4
                transform transition-all duration-300 
                hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25
                active:scale-[0.98]
                relative overflow-hidden group">
              <span className="relative z-10">Add Certificate</span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
                transition-transform duration-300 bg-gradient-to-r from-transparent 
                via-white/10 to-transparent" />
            </button>

            {uploadStatus && (
              <div className={`mt-4 text-sm ${uploadStatus.includes("failed") ? "text-red-400" : "text-green-400"}`}>
                {uploadStatus}
              </div>
            )}
          </div>
        </div>

        {/* 搜索证书部分 */}
        <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-8
          border border-gray-700/50 hover:border-purple-500/50
          transform transition-all duration-500 hover:scale-[1.01]">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-purple-500/10 rounded-xl mr-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Search Certificate
            </h2>
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              value={uniqueIdForFetch}
              onChange={(e) => setUniqueIdForFetch(e.target.value)}
              placeholder="Enter Unique ID to search"
              className="flex-1 rounded-xl bg-gray-800/50 border border-gray-700/50 
                text-gray-300 placeholder-gray-500 
                focus:border-purple-500 focus:ring-purple-500/20 
                transition-all duration-300 px-4 py-3
                hover:border-purple-500/50"
            />
            <button
              onClick={handleFetchCertificate}
              className="px-8 bg-gradient-to-r from-purple-500 to-pink-500 
                text-white rounded-xl transform transition-all duration-300 
                hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25
                active:scale-[0.98]">
              Search
            </button>
          </div>

          {fetchStatus && (
            <div className={`mt-4 text-sm ${fetchStatus.includes("failed") ? "text-red-400" : "text-green-400"}`}>
              {fetchStatus}
            </div>
          )}

          {/* 证书信息显示 */}
          {retrievedCertificate && (
            <div className="mt-8 animate-fadeIn">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700/50">
                  <tbody className="divide-y divide-gray-700/50">
                    {[
                      ["Certificate ID", retrievedCertificate.certificateId],
                      ["Unique ID", retrievedCertificate.uniqueId],
                      ["Batch Code", retrievedCertificate.batchCode],
                      ["State", retrievedCertificate.state],
                      ["Price", retrievedCertificate.price],
                      ["Description", retrievedCertificate.description],
                      ["Production Date", retrievedCertificate.productionDate.toLocaleString()],
                      ["Signature", 
                        <div key="signature" className="flex items-center justify-between">
                          <span>{retrievedCertificate.signature.slice(0, 16) + "..."}</span>
                          <button
                            onClick={async () => {
                              try {
                                const result = await certificateController.verifyCertificate(retrievedCertificate);
                                alert(result ? "Signature verification successful!" : "Signature verification failed!");
                              } catch (error: unknown) {
                                alert("Verification error: " + (error instanceof Error ? error.message : String(error)));
                              }
                            }}
                            className="ml-4 bg-gradient-to-r from-green-500 to-emerald-500 
                              text-white py-2 px-4 rounded-xl
                              transform transition-all duration-300 
                              hover:scale-105 hover:shadow-lg hover:shadow-green-500/25
                              active:scale-[0.98]">
                            Verify Signature
                          </button>
                        </div>
                      ]
                    ].map(([label, value]) => (
                      <tr key={String(label)} className="group transition-colors duration-200 hover:bg-purple-500/5">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                          {label}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
