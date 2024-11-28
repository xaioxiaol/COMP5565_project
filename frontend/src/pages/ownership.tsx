"use client";
import { useState, useEffect } from "react";
import { certificateController } from "@/controllers/CertificateController";
import { ownershipController } from "@/controllers/OwnershipController";
import Certificate from "@/types/Certificate";
import { ethers } from "ethers";
import Ownership from "@/types/Ownership";

export default function OwnershipPage() {
  // States
  const [queryUniqueId, setQueryUniqueId] = useState("");
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [currentOwner, setCurrentOwner] = useState<string>("");
  const [newOwnerAddress, setNewOwnerAddress] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const fetchCertificateAndOwnership = async () => {
    try {
      setIsLoading(true);
      setStatus("Querying...");

      const cert = await certificateController.getCertificate(queryUniqueId);
      setCertificate(cert);

      try {
        const owner = await ownershipController.getCurrentOwner(queryUniqueId);
        setCurrentOwner(owner);
      } catch (error) {
        setCurrentOwner("");
      }

      setStatus("Query successful!");
    } catch (error) {
      console.error(error);
      setStatus(error instanceof Error ? error.message : "Query failed!");
      setCertificate(null);
      setCurrentOwner("");
    } finally {
      setIsLoading(false);
    }
  };

  const transferOwnership = async () => {
    try {
      setStatus("Transferring ownership...");
      const newOwner = new Ownership(
        queryUniqueId,
        newOwnerAddress,
        Date.now()
      );
      await ownershipController.transferOwnership(queryUniqueId, newOwner);
      setStatus("Ownership transfer successful!");
      setNewOwnerAddress("");
      await fetchCertificateAndOwnership();
    } catch (error) {
      console.error(error);
      setStatus(error instanceof Error ? error.message : "Transfer failed!");
    }
  };

  useEffect(() => {
    const checkOwnership = async () => {
      if (!certificate || !window.ethereum) {
        setIsOwner(false);
        return;
      }

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const currentUserAddress = await signer.getAddress();
        const isOwnerStatus =
          currentOwner === "" ||
          currentOwner.toLowerCase() === currentUserAddress.toLowerCase();
        setIsOwner(isOwnerStatus);
      } catch (error) {
        console.error("Check ownership failed:", error);
        setIsOwner(false);
      }
    };

    checkOwnership();
  }, [certificate, currentOwner]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute top-20 left-20 text-7xl transform rotate-12">💎</div>
        <div className="absolute bottom-20 right-20 text-8xl transform -rotate-12">💎</div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Ownership Management System
          </h1>
          <p className="mt-3 text-gray-600">
            Blockchain-based ownership management platform
          </p>
          {status && (
            <div className={`mt-4 text-sm ${status.includes("fail") ? "text-red-600" : "text-green-600"}`}>
              {status}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8 mb-8 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center mb-6">
            <span className="text-3xl mr-3">🔍</span>
            <h2 className="text-2xl font-semibold text-gray-800">Query Certificate</h2>
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              value={queryUniqueId}
              onChange={(e) => setQueryUniqueId(e.target.value)}
              placeholder="Enter a unique ID (Unique ID)"
              className="flex-1 rounded-lg border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 px-4 py-3"
            />
            <button
              onClick={fetchCertificateAndOwnership}
              disabled={isLoading}
              className="px-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Querying..." : "Query"}
            </button>
          </div>

          {certificate && (
            <div className="mt-8">
              <div className="flex items-center mb-6">
                <span className="text-3xl mr-3">💎</span>
                <h3 className="text-2xl font-semibold text-gray-800">Certificate Information</h3>
              </div>
              <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                        Unique ID
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {certificate.uniqueId}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                        Certificate ID
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {certificate.certificateId}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                        Batch Code
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {certificate.batchCode}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                        State
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {certificate.state}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                        Price
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {certificate.price}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                        Description
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {certificate.description}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                        Production Date
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {certificate.productionDate instanceof Date
                          ? certificate.productionDate.toLocaleDateString()
                          : certificate.productionDate}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                        Signature
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {certificate.signature.slice(0, 16) + "..."}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">
                        Current Owner
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {currentOwner || "No owner"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {isOwner && (
                <div className="mt-8">
                  <div className="flex items-center mb-6">
                    <span className="text-3xl mr-3">🔄</span>
                    <h3 className="text-2xl font-semibold text-gray-800">Transfer Ownership</h3>
                  </div>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={newOwnerAddress}
                      onChange={(e) => setNewOwnerAddress(e.target.value)}
                      placeholder="Enter the wallet address of the new owner"
                      className="flex-1 rounded-lg border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 px-4 py-3"
                    />
                    <button
                      onClick={transferOwnership}
                      className="px-8 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Transfer
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
