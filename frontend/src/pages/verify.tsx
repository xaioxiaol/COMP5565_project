"use client";
import React, { useState, useEffect } from "react";
import Certificate from "../types/Certificate"; // Import Certificate type
import { CONFIG } from "@/config";
import { ethers } from "ethers";
import { ipfsService } from "@/utils/ipfs";
import { certificateController } from "../controllers/CertificateController";
import { useWeb3 } from '@/context/Web3Context';
import { getCertificateDetails } from '@/utils/contracts';
import { getFromIPFS } from '@/utils/ipfs';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

export default function VerifyPage() {
  const { provider, isConnected, connect } = useWeb3();
  const router = useRouter();
  const [certificateId, setCertificateId] = useState('');
  const [certificateData, setCertificateData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 从URL参数获取证书ID并自动查询
  useEffect(() => {
    const { id } = router.query;
    if (id && typeof id === 'string') {
      setCertificateId(id);
      handleVerify(id);
    }
  }, [router.query]);

  const handleVerify = async (id?: string) => {
    const uniqueId = id || certificateId;
    if (!uniqueId) {
      toast.error('请输入证书ID');
      return;
    }

    if (!isConnected) {
      try {
        await connect();
      } catch (error) {
        toast.error('请先连接钱包');
        return;
      }
    }
    
    setLoading(true);
    try {
      const certificate = await certificateController.getCertificate(uniqueId);
      setCertificateData(certificate);
      toast.success('证书验证成功');
    } catch (error) {
      console.error('证书验证失败:', error);
      toast.error('证书验证失败，请确认证书ID是否正确');
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      {/* 装饰性钻石背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute top-20 left-20 text-7xl transform rotate-12">💎</div>
        <div className="absolute bottom-20 right-20 text-8xl transform -rotate-12">💎</div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            证书验证系统
          </h1>
          <p className="mt-4 text-gray-600">
            验证您的珠宝证书真实性
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center space-x-4 mb-8">
            <div className="relative flex-1">
              <input
                type="text"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder="输入证书编号"
                className="w-full p-4 pr-12 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            <button
              onClick={() => handleVerify()}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
=======
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
>>>>>>> 7f3fe072ec9b13b339b0f2cadc8d19b7340cf1f2
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  验证中...
                </span>
              ) : '验证证书'}
            </button>
          </div>
<<<<<<< HEAD

          {certificateData && (
            <div className="mt-8 space-y-6 animate-fadeIn">
              <div className="flex items-center mb-6">
                <span className="text-3xl mr-3">💎</span>
                <h3 className="text-2xl font-semibold text-gray-800">证书信息</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg transform transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center text-gray-700 mb-2">
                    <span className="mr-2 text-blue-500">👤</span>
                    <span className="font-medium">证书ID</span>
                  </div>
                  <p className="text-gray-600 break-all">{certificateData.certificateId}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg transform transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center text-gray-700 mb-2">
                    <span className="mr-2 text-blue-500">🔢</span>
                    <span className="font-medium">唯一ID</span>
                  </div>
                  <p className="text-gray-600">{certificateData.uniqueId}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg transform transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center text-gray-700 mb-2">
                    <span className="mr-2 text-blue-500">📦</span>
                    <span className="font-medium">批次号</span>
                  </div>
                  <p className="text-gray-600">{certificateData.batchCode}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg transform transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center text-gray-700 mb-2">
                    <span className="mr-2 text-blue-500">📊</span>
                    <span className="font-medium">状态</span>
                  </div>
                  <p className="text-gray-600">{certificateData.state}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg transform transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center text-gray-700 mb-2">
                    <span className="mr-2 text-blue-500">💰</span>
                    <span className="font-medium">价格</span>
                  </div>
                  <p className="text-gray-600">{certificateData.price}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg transform transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center text-gray-700 mb-2">
                    <span className="mr-2 text-blue-500">📝</span>
                    <span className="font-medium">描述</span>
                  </div>
                  <p className="text-gray-600">{certificateData.description}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg transform transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center text-gray-700 mb-2">
                    <span className="mr-2 text-blue-500">📅</span>
                    <span className="font-medium">生产日期</span>
                  </div>
                  <p className="text-gray-600">
                    {new Date(certificateData.productionDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg transform transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center text-gray-700 mb-2">
                    <span className="mr-2 text-blue-500">✍️</span>
                    <span className="font-medium">签名</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 truncate">
                      {certificateData.signature.slice(0, 16)}...
                    </p>
                    <button
                      onClick={async () => {
                        try {
                          const result = await certificateController.verifyCertificate(certificateData);
                          toast.success(result ? '签名验证成功！' : '签名验证失败！');
                        } catch (error) {
                          toast.error('验证失败: ' + (error instanceof Error ? error.message : String(error)));
                        }
                      }}
                      className="ml-4 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:from-green-600 hover:to-green-700"
                    >
                      验证签名
                    </button>
=======
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
>>>>>>> 7f3fe072ec9b13b339b0f2cadc8d19b7340cf1f2
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
