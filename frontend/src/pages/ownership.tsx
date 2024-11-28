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
    <div className="min-h-screen bg-[#0c0c1d] bg-opacity-95 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" />
      <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow delay-75" />
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow delay-150" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="text-center mb-12 relative">
          <div className="inline-block">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 animate-gradient-x mb-4">
              Ownership Management
            </h1>
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse-slow" />
          </div>
          <p className="mt-4 text-gray-300 text-lg">
            Blockchain-based ownership management platform
          </p>
          {status && (
            <div className={`mt-4 text-sm ${status.includes("fail") ? "text-red-400" : "text-green-400"}`}>
              {status}
            </div>
          )}
        </div>

        <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-8 mb-8 
          border border-gray-700/50 hover:border-purple-500/50
          transform transition-all duration-500 hover:scale-[1.01]
          relative overflow-hidden group">
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          
          <div className="relative">
            <div className="flex items-center mb-8">
              <div className="p-3 bg-purple-500/10 rounded-xl mr-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Query Certificate
              </h2>
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                value={queryUniqueId}
                onChange={(e) => setQueryUniqueId(e.target.value)}
                placeholder="Enter a unique ID"
                className="flex-1 rounded-xl bg-gray-800/50 border border-gray-700/50 
                  text-gray-300 placeholder-gray-500 
                  focus:border-purple-500 focus:ring-purple-500/20 
                  transition-all duration-300 px-4 py-3
                  hover:border-purple-500/50"
              />
              <button
                onClick={fetchCertificateAndOwnership}
                disabled={isLoading}
                className="px-8 bg-gradient-to-r from-purple-500 to-pink-500 
                  text-white font-medium rounded-xl
                  transform transition-all duration-300 
                  hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25
                  active:scale-[0.98] disabled:opacity-50 
                  disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Querying...
                  </span>
                ) : "Query"}
              </button>
            </div>
          </div>
        </div>

        {certificate && (
          <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl overflow-hidden
            border border-gray-700/50 transition-all duration-300
            hover:border-purple-500/50 animate-fadeIn">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-purple-500/10 rounded-xl mr-4">
                  <span className="text-2xl">💎</span>
                </div>
                <h2 className="text-2xl font-semibold bg-clip-text text-transparent 
                  bg-gradient-to-r from-purple-400 to-pink-400">
                  Certificate Details
                </h2>
              </div>

              <div className="space-y-4">
                <table className="min-w-full divide-y divide-gray-700/50">
                  <tbody className="divide-y divide-gray-700/50">
                    {[
                      ["Unique ID", certificate.uniqueId],
                      ["Certificate ID", certificate.certificateId],
                      ["Batch Code", certificate.batchCode],
                      ["State", certificate.state],
                      ["Price", certificate.price],
                      ["Description", certificate.description],
                      ["Production Date", certificate.productionDate instanceof Date
                        ? certificate.productionDate.toLocaleDateString()
                        : certificate.productionDate],
                      ["Signature", certificate.signature.slice(0, 16) + "..."],
                      ["Current Owner", currentOwner || "No owner"]
                    ].map(([label, value]) => (
                      <tr key={label} className="group transition-colors duration-200 hover:bg-purple-500/5">
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

              {isOwner && (
                <div className="mt-8 p-6 bg-gray-800/30 rounded-xl border border-gray-700/50">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-green-500/10 rounded-xl mr-4">
                      <span className="text-2xl">🔄</span>
                    </div>
                    <h3 className="text-2xl font-semibold bg-clip-text text-transparent 
                      bg-gradient-to-r from-green-400 to-emerald-400">
                      Transfer Ownership
                    </h3>
                  </div>

                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={newOwnerAddress}
                      onChange={(e) => setNewOwnerAddress(e.target.value)}
                      placeholder="Enter new owner's wallet address"
                      className="flex-1 rounded-xl bg-gray-800/50 border border-gray-700/50 
                        text-gray-300 placeholder-gray-500 
                        focus:border-green-500 focus:ring-green-500/20 
                        transition-all duration-300 px-4 py-3
                        hover:border-green-500/50"
                    />
                    <button
                      onClick={transferOwnership}
                      className="px-8 bg-gradient-to-r from-green-500 to-emerald-500 
                        text-white font-medium rounded-xl
                        transform transition-all duration-300 
                        hover:scale-105 hover:shadow-lg hover:shadow-green-500/25
                        active:scale-[0.98]"
                    >
                      Transfer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
