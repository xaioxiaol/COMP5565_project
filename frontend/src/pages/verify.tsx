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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Certificate Verification Program
        </h1>

        {/* Search Certificate Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Search Certificate
          </h2>
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
            <div className="max-w-3xl mx-auto p-8">
              <div className="transform transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                <div className="bg-[#faf6eb] border-8 border-double border-[#234e70] p-8 rounded-lg shadow-2xl relative">
                  {/* Decorative corners */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#234e70] -translate-x-2 -translate-y-2"></div>
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#234e70] translate-x-2 -translate-y-2"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#234e70] -translate-x-2 translate-y-2"></div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#234e70] translate-x-2 translate-y-2"></div>

                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif text-[#234e70] mb-2">
                      E-Certificate of Jewelry
                    </h1>
                    <div className="w-32 h-1 bg-[#234e70] mx-auto"></div>
                  </div>

                  <div className="space-y-6">
                    <div className="certificate-row">
                      <span className="font-serif text-[#234e70] font-semibold">
                        Certificate ID:
                      </span>
                      <span className="text-gray-700">
                        {retrievedCertificate.certificateId}
                      </span>
                    </div>

                    <div className="certificate-row">
                      <span className="font-serif text-[#234e70] font-semibold">
                        Unique ID:
                      </span>
                      <span className="text-gray-700">
                        {retrievedCertificate.uniqueId}
                      </span>
                    </div>

                    <div className="certificate-row">
                      <span className="font-serif text-[#234e70] font-semibold">
                        Batch Code:
                      </span>
                      <span className="text-gray-700">
                        {retrievedCertificate.batchCode}
                      </span>
                    </div>

                    <div className="certificate-row">
                      <span className="font-serif text-[#234e70] font-semibold">
                        State:
                      </span>
                      <span className="text-gray-700">
                        {retrievedCertificate.state}
                      </span>
                    </div>

                    <div className="certificate-row">
                      <span className="font-serif text-[#234e70] font-semibold">
                        Price:
                      </span>
                      <span className="text-gray-700">
                        {retrievedCertificate.price}
                      </span>
                    </div>

                    <div className="certificate-row">
                      <span className="font-serif text-[#234e70] font-semibold">
                        Description:
                      </span>
                      <span className="text-gray-700">
                        {retrievedCertificate.description}
                      </span>
                    </div>

                    <div className="certificate-row">
                      <span className="font-serif text-[#234e70] font-semibold">
                        Production Date:
                      </span>
                      <span className="text-gray-700">
                        {retrievedCertificate.productionDate.toLocaleString()}
                      </span>
                    </div>

                    <div className="certificate-row">
                      <span className="font-serif text-[#234e70] font-semibold">
                        Signature:
                      </span>
                      <div className="flex items-center gap-4">
                        {/* <span className="text-gray-700"></span> */}
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
                          className="transform transition-all duration-300 bg-[#234e70] text-white py-2 px-4 rounded-md 
                            hover:bg-[#1a3a54] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#234e70] focus:ring-offset-2"
                        >
                          Verify Signature:{" "}
                          {retrievedCertificate.signature.slice(0, 16) + "..."}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Optional: Add a watermark or seal */}
                  <div className="absolute bottom-4 right-4">
                    <div className="w-24 h-24 border-4 border-[#cc1818] rounded-full flex items-center justify-center rotate-12 opacity-80">
                      <div className="absolute inset-0 bg-[#ff0000] opacity-10 rounded-full"></div>
                      <span className="font-serif text-[#cc1818] text-xs font-bold tracking-wider">VERIFIED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
