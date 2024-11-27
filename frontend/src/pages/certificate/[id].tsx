import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { getCertificateDetails } from '@/utils/contracts';
import TransferCertificate from '@/components/TransferCertificate';
import { Certificate } from '@/types/contracts';

export default function CertificateDetailsPage() {
    const router = useRouter();
    const { id } = router.query;
    const { provider, account } = useWeb3();
    const [certificate, setCertificate] = useState<Certificate | null>(null);
    const [loading, setLoading] = useState(true);

    const loadCertificateData = async () => {
        if (!provider || !id) return;
        
        try {
            const data = await getCertificateDetails(provider, Number(id));
            setCertificate({
                id: Number(id),
                currentOwner: data.currentOwner,
                ipfsHash: data.ipfsHash,
                status: data.status,
                isTransferable: data.isTransferable,
                timestamp: Math.floor(Date.now() / 1000)
            });
        } catch (error) {
            console.error('加载证书详情失败:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCertificateData();
    }, [provider, id]);

    if (!id) return null;  // 添加这行来处理初始加载

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">证书详情 #{id}</h1>
            
            {loading ? (
                <div>加载中...</div>
            ) : certificate ? (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div>证书ID: {id}</div>
                        <div>当前所有者: {certificate.currentOwner}</div>
                        <div>状态: {certificate.status}</div>
                        <div>创建时间: {new Date(certificate.timestamp * 1000).toLocaleString()}</div>
                    </div>

                    {certificate.currentOwner.toLowerCase() === account?.toLowerCase() && 
                     certificate.isTransferable && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">转让证书</h2>
                            <TransferCertificate 
                                certificateId={Number(id)}
                                onTransferComplete={loadCertificateData}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div>证书不存在</div>
            )}
        </div>
    );
}