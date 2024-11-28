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
      if (retrievedCertificate?.certificateId) setFetchStatus("Retrieved successfully!");
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Certificate Verification Program
        </h1>

        {/* Search Certificate Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Search Certificate</h2>
          <div className="flex gap-4">
            <input
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
              type="text"
              placeholder="Enter Unique ID to search"
              value={uniqueIdForFetch}
              onChange={(e) => setUniqueIdForFetch(e.target.value)}
            />
            <button
              onClick={() => handleFetchCertificate()}
              className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Search
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
                            alert(result ? "Signature verification successful!" : "Signature verification failed!");
                          } catch (error: unknown) {
                            alert("Verification error: " + (error instanceof Error ? error.message : String(error)));
                          }
                        }}
                        className="ml-4 bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        Verify Signature
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
