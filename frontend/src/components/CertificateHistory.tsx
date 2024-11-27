import { useState, useEffect } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { getCertificateHistory } from '@/utils/contracts';
import { ipfsService } from '@/utils/ipfs';
import { getCertificateStatus } from '../utils/certificates';

interface CertificateHistoryProps {
    certificateId: number;
}

export default function CertificateHistory({ certificateId }: CertificateHistoryProps) {
    const { provider } = useWeb3();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (provider && certificateId) {
            loadHistory();
        }
    }, [provider, certificateId]);

    const loadHistory = async () => {
        if (!provider) return;
        setLoading(true);
        try {
            const history = await getCertificateHistory(provider, certificateId);
            
            const historyData = await Promise.all(
                history.map(async (record) => {
                    const ipfsData = await ipfsService.getJSON(record.ipfsHash);
                    return {
                        ...record,
                        timestamp: new Date(record.timestamp * 1000),
                        details: ipfsData
                    };
                })
            );

            setHistory(historyData);
        } catch (error) {
            console.error('加载历史记录失败:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">证书历史记录</h3>
            {loading ? (
                <div>加载中...</div>
            ) : (
                <div className="space-y-4">
                    {history.map((record, index) => (
                        <div key={index} className="border p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="font-medium">时间</div>
                                    <div>{record.timestamp.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="font-medium">操作者</div>
                                    <div className="text-sm">{record.operator}</div>
                                </div>
                                <div>
                                    <div className="font-medium">状态</div>
                                    <div>{getCertificateStatus(record.status)}</div>
                                </div>
                                <div>
                                    <div className="font-medium">详情</div>
                                    <div className="text-sm">{JSON.stringify(record.details)}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 