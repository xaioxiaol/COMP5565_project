import { useWeb3 } from '@/context/Web3Context';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
    const { account, isConnected, connect } = useWeb3();
    const router = useRouter();

    const navItems = [
        { href: '/', label: '首页' },
        { href: '/verify', label: '证书验证' },
        { href: '/manage', label: '证书管理' },
    ];

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium ${
                                    router.pathname === item.href
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center">
                        {!isConnected ? (
                            <button
                                onClick={connect}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600"
                            >
                                连接钱包
                            </button>
                        ) : (
                            <span className="text-sm text-gray-500">
                                {`${account.substring(0, 6)}...${account.substring(38)}`}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
} 