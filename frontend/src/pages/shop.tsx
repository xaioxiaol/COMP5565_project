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
                toast.error('Please connect your wallet first');
                return;
            }

            // Convert the product price to ETH amount (simple example: 1 USD = 0.0001 ETH)
            const priceInEth = (parseFloat(product.price) * 0.0001).toFixed(4);
            
            // Create a transaction
            const tx = await signer.sendTransaction({
                to: await signer.getAddress(), // This should be replaced with the merchant's wallet address
                value: ethers.utils.parseEther(priceInEth)
            });

            // Wait for the transaction to be confirmed
            await tx.wait();
            
            toast.success('Payment successful!');
            
            // Redirect to the certificate verification page
            router.push(`/verify?id=${product.uniqueId}`);
        } catch (error) {
            console.error('Payment failed:', error);
            toast.error('Payment failed, please try again');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0c0c1d] to-[#1a1a2f]">
            {/* Diamond decorative background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
                <div className="absolute top-20 left-20 text-7xl transform rotate-12">💎</div>
                <div className="absolute bottom-20 right-20 text-8xl transform -rotate-12">💎</div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400">
                        Jewelry Boutique
                    </h1>
                    <p className="mt-3 text-gray-400">
                        Each piece comes with a blockchain certificate for authenticity and traceability
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-[#1c1c3d] rounded-xl shadow-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-purple-500/20"
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
                            <h2 className="text-xl font-semibold text-gray-100 mb-2">{product.name}</h2>
                            <p className="text-gray-400 mb-4 h-20 overflow-hidden">
                                {product.description}
                            </p>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                    ${parseInt(product.price).toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-400">
                                    Certificate ID: {product.certificateId}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => router.push(`/verify?id=${product.uniqueId}`)}
                                    className="w-full bg-[#2a2a4a] text-gray-200 py-3 px-4 rounded-lg transform transition-all duration-300 
                                    hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 hover:bg-[#2a2a5a] 
                                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#1c1c3d]"
                                >
                                    View Certificate
                                </button>
                                <button
                                    onClick={() => handleBuy(product)}
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg 
                                    transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 
                                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#1c1c3d]"
                                >
                                    {isConnected ? 'Buy Now' : 'Connect Wallet'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 