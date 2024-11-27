import { useWeb3 } from '@/context/Web3Context';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
    const { isConnected } = useWeb3();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
                        钻石证书认证系统
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        基于区块链的钻石真品证书管理系统，确保每颗钻石的真实性和可追溯性。
                    </p>
                </div>

                <div className="mt-16">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {/* 功能卡片 1 */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="text-2xl font-semibold mb-4">证书验证</div>
                            <p className="text-gray-600 mb-4">
                                轻松验证钻石证书的真实性，查看完整的认证历史。
                            </p>
                            <Link
                                href="/verify"
                                className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            >
                                立即验证
                            </Link>
                        </div>

                        {/* 功能卡片 2 */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="text-2xl font-semibold mb-4">证书管理</div>
                            <p className="text-gray-600 mb-4">
                                为制造商提供完整的证书管理功能，包括创建、更新和转让。
                            </p>
                            <Link
                                href="/manage"
                                className={`inline-block px-4 py-2 rounded-md ${
                                    isConnected
                                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                进入管理
                            </Link>
                        </div>

                        {/* 功能卡片 3 */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="text-2xl font-semibold mb-4">全程追溯</div>
                            <p className="text-gray-600 mb-4">
                                从开采到制作，记录钻石的完整生命周期，确保透明度。
                            </p>
                            <div className="text-sm text-gray-500">
                                包含完整的认证流程
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16">
                    <h2 className="text-3xl font-bold text-center mb-8">认证流程</h2>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {[
                            '开采认证',
                            '切割认证',
                            '质量认证',
                            '制作认证',
                            '所有权认证'
                        ].map((step, index) => (
                            <div
                                key={step}
                                className="flex flex-col items-center"
                            >
                                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                    {index + 1}
                                </div>
                                <div className="mt-2 text-center">{step}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 