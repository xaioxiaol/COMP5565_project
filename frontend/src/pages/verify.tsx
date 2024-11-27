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
            toast.success('证书验证成功');
        } catch (error) {
            console.error(error);
            toast.error('证书验证失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-2xl mx-auto mt-8">
                <h1 className="text-2xl font-bold mb-6">证书验证</h1>
                
                <div className="mb-4">
                    <input
                        type="text"
                        value={certificateId}
                        onChange={(e) => setCertificateId(e.target.value)}
                        placeholder="输入证书ID"
                        className="w-full p-2 border rounded"
                    />
                </div>

                <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                    {loading ? '验证中...' : '验证证书'}
                </button>

                {certificateData && (
                    <div className="mt-6 p-4 border rounded">
                        <h2 className="text-xl font-semibold mb-4">证书信息</h2>
                        <div className="space-y-2">
                            <p>当前所有者: {certificateData.currentOwner}</p>
                            <p>状态: {getCertificateStatus(certificateData.status)}</p>
                            <p>名称: {certificateData.name}</p>
                            <p>描述: {certificateData.description}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function getCertificateStatus(status: number): string {
    const statusMap = {
        0: '初始创建',
        1: '开采完成',
        2: '切割完成',
        3: '质量认证完成',
        4: '珠宝制作完成',
        5: '已售出'
    };
    return statusMap[status as keyof typeof statusMap] || '未知状态';
} 