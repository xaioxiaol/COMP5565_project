import { useWeb3 } from '@/context/Web3Context';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
    const { account, isConnected, connect } = useWeb3();
    const router = useRouter();

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="text-xl font-bold text-gray-800">
                                Diamond Tracing System
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center">
                        {!isConnected ? (
                            <button
                                onClick={connect}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600"
                            >
                                Connect Wallet
                            </button>
                        ) : (
                            <span className="text-sm text-gray-500">
                                {account.slice(0, 6)}...{account.slice(-4)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
} 