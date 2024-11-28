import { useRouter } from 'next/router';
import { products } from '@/types/Product';
import Image from 'next/image';
import { useWeb3 } from '@/context/Web3Context';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

export default function ShopPage() {
    const router = useRouter();
    const { provider, isConnected, connect } = useWeb3();

    const handleBuy = async (product: typeof products[0]) => {
        try {
            if (!isConnected) {
                await connect();
                return;
            }

            const signer = provider?.getSigner();
            if (!signer) {
                toast.error('请先连接钱包');
                return;
            }

            // 将商品价格转换为以太币金额（这里简单示例：1元 = 0.0001 ETH）
            const priceInEth = (parseFloat(product.price) * 0.0001).toFixed(4);
            
            // 创建交易
            const tx = await signer.sendTransaction({
                to: await signer.getAddress(), // 这里应该替换为商家的钱包地址
                value: ethers.utils.parseEther(priceInEth)
            });

            // 等待交易确认
            await tx.wait();
            
            toast.success('支付成功！');
            
            // 跳转到证书查询页面
            router.push(`/verify?id=${product.uniqueId}`);
        } catch (error) {
            console.error('支付失败:', error);
            toast.error('支付失败，请重试');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* 装饰性钻石背景 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
                <div className="absolute top-20 left-20 text-7xl transform rotate-12">💎</div>
                <div className="absolute bottom-20 right-20 text-8xl transform -rotate-12">💎</div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        珠宝精品商城
                    </h1>
                    <p className="mt-3 text-gray-600">
                        每件商品都配备区块链证书，确保真实可溯
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl shadow-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                        >
                            <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    layout="fill"
                                    objectFit="cover"
                                    className="transform transition-transform duration-300 hover:scale-110"
                                />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>
                            <p className="text-gray-600 mb-4 h-20 overflow-hidden">
                                {product.description}
                            </p>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-2xl font-bold text-purple-600">
                                    ¥{parseInt(product.price).toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-500">
                                    证书编号: {product.certificateId}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => router.push(`/verify?id=${product.uniqueId}`)}
                                    className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                                >
                                    查看证书
                                </button>
                                <button
                                    onClick={() => handleBuy(product)}
                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    {isConnected ? '购买' : '连接钱包'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 