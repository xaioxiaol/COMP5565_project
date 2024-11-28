import { useWeb3 } from '@/context/Web3Context';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
    const { account, isConnected, connect } = useWeb3();
    const router = useRouter();

    return (
        <nav className="sticky top-0 z-50 bg-[#0c0c1d]/80 backdrop-blur-lg border-b border-purple-500/20">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link 
                                href="/" 
                                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
                                from-purple-400 via-pink-500 to-cyan-400 hover:opacity-80 transition-opacity"
                            >
                                Diamond Tracing System
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center">
                        {!isConnected ? (
                            <button
                                onClick={connect}
                                className="relative group px-6 py-2 rounded-xl font-medium
                                    bg-gradient-to-r from-purple-500 to-pink-500 
                                    hover:from-purple-600 hover:to-pink-600
                                    text-white shadow-lg shadow-purple-500/25 
                                    hover:shadow-purple-500/50 
                                    transition-all duration-300
                                    overflow-hidden"
                            >
                                <span className="relative z-10">Connect Wallet</span>
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 
                                    bg-gradient-to-r from-purple-600 to-pink-600 transition-transform duration-300"></div>
                            </button>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="px-4 py-2 rounded-xl text-sm text-gray-300 
                                    bg-gray-800/50 border border-gray-700/50 backdrop-blur-xl
                                    hover:border-purple-500/50 transition-colors duration-300">
                                    {account.slice(0, 6)}...{account.slice(-4)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 装饰性光效 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl"></div>
                <div className="absolute -top-4 right-1/4 w-32 h-32 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-xl"></div>
            </div>
        </nav>
    );
} 