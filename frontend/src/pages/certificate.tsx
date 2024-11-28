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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* 装饰性钻石背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute top-20 left-20 text-7xl transform rotate-12">💎</div>
        <div className="absolute bottom-20 right-20 text-8xl transform -rotate-12">💎</div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Certificate Management System
          </h1>
          <p className="mt-3 text-gray-600">
            Create and manage your diamond certificates with blockchain security
          </p>
        </div>

        {/* Add Certificate Form */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center mb-6">
            <span className="text-3xl mr-3">📜</span>
            <h2 className="text-2xl font-semibold text-gray-800">Add New Certificate</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              className="block w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 px-4 py-3"
              type="text"
              placeholder="Certificate ID"
              value={certificate.certificateId}
              onChange={(e) => handleInputChange("certificateId", e.target.value)}
            />
            <input
              className="block w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 px-4 py-3"
              type="text"
              placeholder="Unique ID"
              value={certificate.uniqueId}
              onChange={(e) => handleInputChange("uniqueId", e.target.value)}
            />
            <input
              className="block w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 px-4 py-3"
              type="text"
              placeholder="Batch Code"
              value={certificate.batchCode}
              onChange={(e) => handleInputChange("batchCode", e.target.value)}
            />
            <input
              className="block w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 px-4 py-3"
              type="text"
              placeholder="State"
              value={certificate.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
            />
            <input
              className="block w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 px-4 py-3"
              type="text"
              placeholder="Price"
              value={certificate.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
            />
            <input
              className="block w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 px-4 py-3"
              type="date"
              placeholder="Production Date"
              value={certificate.productionDate instanceof Date ? certificate.productionDate.toISOString().split("T")[0] : ""}
              onChange={(e) => handleInputChange("productionDate", e.target.value)}
            />
            <textarea
              className="block w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 px-4 py-3 md:col-span-2"
              placeholder="Description"
              value={certificate.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
            <input
              className="block w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 px-4 py-3 md:col-span-2"
              type="text"
              placeholder="Signature"
              value={certificate.signature}
              onChange={(e) => handleInputChange("signature", e.target.value)}
            />
          </div>
          <button
            onClick={handleUploadCertificate}
            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Certificate
          </button>
          {uploadStatus && (
            <p className={`mt-2 text-sm ${uploadStatus.includes("failed") ? "text-red-600" : "text-green-600"}`}>
              {uploadStatus}
            </p>
          )}
        </div>

        {/* Search Certificate Section */}
        <div className="bg-white rounded-xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center mb-6">
            <span className="text-3xl mr-3">🔍</span>
            <h2 className="text-2xl font-semibold text-gray-800">Search Certificate</h2>
          </div>
          <div className="flex gap-4">
            <input
              className="flex-1 rounded-lg border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 px-4 py-3"
              type="text"
              placeholder="Enter Unique ID to search"
              value={uniqueIdForFetch}
              onChange={(e) => setUniqueIdForFetch(e.target.value)}
            />
            <button
              onClick={handleFetchCertificate}
              className="px-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Search
            </button>
          </div>
          {fetchStatus && (
            <p className={`mt-2 text-sm ${fetchStatus.includes("failed") ? "text-red-600" : "text-green-600"}`}>
              {fetchStatus}
            </p>
          )}

          {/* Retrieved Certificate Display */}
          {retrievedCertificate && (
            <div className="mt-8 space-y-6 animate-fadeIn">
              <div className="flex items-center mb-6">
                <span className="text-3xl mr-3">💎</span>
                <h3 className="text-2xl font-semibold text-gray-800">Certificate Information</h3>
              </div>
              <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-100 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                        Certificate ID
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {retrievedCertificate.certificateId}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                        Unique ID
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {retrievedCertificate.uniqueId}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                        Batch Code
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {retrievedCertificate.batchCode}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                        State
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {retrievedCertificate.state}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                        Price
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {retrievedCertificate.price}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                        Description
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {retrievedCertificate.description}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                        Production Date
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {retrievedCertificate.productionDate.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                        Signature
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex justify-between items-center">
                        {retrievedCertificate.signature.slice(0, 16) + "..."}
                        <button
                          onClick={async () => {
                            try {
                              const result = await certificateController.verifyCertificate(retrievedCertificate);
                              alert(result ? "Signature verification successful!" : "Signature verification failed!");
                            } catch (error: unknown) {
                              alert("Verification error: " + (error instanceof Error ? error.message : String(error)));
                            }
                          }}
                          className="ml-4 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                          Verify Signature
                        </button>
                      </td>
                    </tr>
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
