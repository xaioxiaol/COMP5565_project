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
      setStatus("正在查询...");

      const cert = await certificateController.getCertificate(queryUniqueId);
      setCertificate(cert);

      try {
        const owner = await ownershipController.getCurrentOwner(queryUniqueId);
        setCurrentOwner(owner);
      } catch (error) {
        setCurrentOwner("");
      }

      setStatus("查询成功！");
    } catch (error) {
      console.error(error);
      setStatus(error instanceof Error ? error.message : "查询失败！");
      setCertificate(null);
      setCurrentOwner("");
    } finally {
      setIsLoading(false);
    }
  };

  const transferOwnership = async () => {
    try {
      setStatus("正在转让所有权...");
      const newOwner = new Ownership(
        queryUniqueId,
        newOwnerAddress,
        Date.now()
      );
      await ownershipController.transferOwnership(queryUniqueId, newOwner);
      setStatus("所有权转让成功！");
      setNewOwnerAddress("");
      await fetchCertificateAndOwnership();
    } catch (error) {
      console.error(error);
      setStatus(error instanceof Error ? error.message : "转让失败！");
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
        console.error("检查所有权失败:", error);
        setIsOwner(false);
      }
    };

    checkOwnership();
  }, [certificate, currentOwner]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            所有权管理系统
          </h1>
          <p className="text-gray-600">基于区块链的所有权管理平台</p>
          {status && (
            <div
              className={`mt-4 text-sm ${
                status.includes("失败") ? "text-red-600" : "text-green-600"
              }`}
            >
              {status}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={queryUniqueId}
              onChange={(e) => setQueryUniqueId(e.target.value)}
              placeholder="输入唯一标识 (Unique ID)"
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              onClick={fetchCertificateAndOwnership}
              disabled={isLoading}
              className="px-8 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 disabled:bg-gray-400"
            >
              {isLoading ? "查询中..." : "查询"}
            </button>
          </div>

          {certificate && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                证书信息
              </h3>
              <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
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
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    转让所有权
                  </h3>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={newOwnerAddress}
                      onChange={(e) => setNewOwnerAddress(e.target.value)}
                      placeholder="输入新所有者的钱包地址"
                      className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <button
                      onClick={transferOwnership}
                      className="px-8 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      转让
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
