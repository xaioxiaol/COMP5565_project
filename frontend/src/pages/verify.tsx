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
