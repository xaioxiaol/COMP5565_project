import { useWeb3 } from "@/context/Web3Context";
import Link from "next/link";

export default function HomePage() {
  const { isConnected } = useWeb3();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* 装饰性钻石背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-10 left-10 text-6xl text-blue-500">💎</div>
        <div className="absolute top-1/3 right-20 text-8xl text-purple-500">💎</div>
        <div className="absolute bottom-20 left-1/4 text-5xl text-pink-500">💎</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Diamond Certificate Certification System
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            The blockchain-based diamond authenticity certificate management system ensures the authenticity and traceability of each diamond.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
            {/* 功能卡片 1 */}
            <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3">📜</span>
                <div className="text-2xl font-semibold">Certificate Verification</div>
              </div>
              <p className="text-gray-600 mb-4">
                Easily verify the authenticity of your diamond certificate and view your complete certification history.
              </p>
              <Link
                href="/verify"
                className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Verify now
              </Link>
            </div>

            {/* 功能卡片 2 */}
            <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3">💎</span>
                <div className="text-2xl font-semibold">Certificate Management</div>
              </div>
              <p className="text-gray-600 mb-4">
                Provides manufacturers with complete certificate management capabilities, including creation, renewal and transfer.
              </p>
              <Link
                href="/certificate"
                className={`inline-flex items-center px-6 py-2 rounded-md transition-all duration-300 shadow-md hover:shadow-lg ${
                  isConnected
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Enter management
              </Link>
            </div>

            {/* 功能卡片 3 */}
            <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3">📋</span>
                <div className="text-2xl font-semibold">Full traceability</div>
              </div>
              <p className="text-gray-600 mb-4">
                From mining to production, the entire life cycle of a diamond is recorded to ensure transparency.
              </p>
              <Link
                href="/auditTrails"
                className={`inline-flex items-center px-6 py-2 rounded-md transition-all duration-300 shadow-md hover:shadow-lg ${
                  isConnected
                    ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Audit records
              </Link>
            </div>

            {/* 功能卡片 4 */}
            <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3">🔄</span>
                <div className="text-2xl font-semibold">Transfer of ownership</div>
              </div>
              <p className="text-gray-600 mb-4">
                Transferring Jewelry Certificate Ownership
              </p>
              <Link
                href="/ownership"
                className={`inline-flex items-center px-6 py-2 rounded-md transition-all duration-300 shadow-md hover:shadow-lg ${
                  isConnected
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Transferring Ownership
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
