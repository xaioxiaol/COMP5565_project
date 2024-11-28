import { useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { getCertificateDetails } from '@/utils/contracts';
import { getFromIPFS } from '@/utils/ipfs';
import toast from 'react-hot-toast';

export default function VerifyPage() {
    const { provider } = useWeb3();
    const [certificateId, setCertificateId] = useState('');
    const [certificateData, setCertificateData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (!certificateId || !provider) return;
        
        setLoading(true);
        try {
            const details = await getCertificateDetails(provider, parseInt(certificateId));
            const ipfsData = await getFromIPFS(details.ipfsHash);
            
            setCertificateData({
                ...details,
                ...ipfsData
            });
            toast.success('Certificate verification successful');
        } catch (error) {
            console.error(error);
            toast.error('Certificate verification failed');
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
                        Certificate Verification
                    </h1>
                    <p className="mt-4 text-gray-600">
                        Verify the authenticity of your diamond certificate using its unique identifier
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={certificateId}
                                onChange={(e) => setCertificateId(e.target.value)}
                                placeholder="Enter the certificate ID"
                                className="w-full p-4 pr-12 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                        </div>
                        <button
                            onClick={handleVerify}
                            disabled={loading}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </span>
                            ) : 'Verify Certificate'}
                        </button>
                    </div>

                    {certificateData && (
                        <div className="mt-8 space-y-6 animate-fadeIn">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                                <span className="text-blue-500 mr-3">💎</span>
                                Certificate Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg transform transition-all duration-300 hover:shadow-md">
                                    <div className="flex items-center text-gray-700 mb-2">
                                        <span className="mr-2 text-blue-500">👤</span>
                                        <span className="font-medium">Current Owner</span>
                                    </div>
                                    <p className="text-gray-600 break-all">{certificateData.currentOwner}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg transform transition-all duration-300 hover:shadow-md">
                                    <div className="flex items-center text-gray-700 mb-2">
                                        <span className="mr-2 text-blue-500">ℹ️</span>
                                        <span className="font-medium">Status</span>
                                    </div>
                                    <p className="text-gray-600">{getCertificateStatus(certificateData.status)}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg transform transition-all duration-300 hover:shadow-md">
                                    <div className="flex items-center text-gray-700 mb-2">
                                        <span className="mr-2 text-blue-500">💎</span>
                                        <span className="font-medium">Name</span>
                                    </div>
                                    <p className="text-gray-600">{certificateData.name}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg transform transition-all duration-300 hover:shadow-md">
                                    <div className="flex items-center text-gray-700 mb-2">
                                        <span className="mr-2 text-blue-500">📝</span>
                                        <span className="font-medium">Description</span>
                                    </div>
                                    <p className="text-gray-600">{certificateData.description}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function getCertificateStatus(status: number): string {
    const statusMap = {
        0: 'Initial creation',
        1: 'Mining completed',
        2: 'Cutting completed',
        3: 'Quality certification completed',
        4: 'Jewelry production completed',
        5: 'Sold'
    };
    return statusMap[status as keyof typeof statusMap] || 'Unknown status';
} 