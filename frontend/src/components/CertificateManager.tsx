import { useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { updateCertificateStatus, ROLES } from '@/utils/contracts';
import { ipfsService } from '@/utils/ipfs';
import { CertificateStatus } from '@/types/contracts';
import toast from 'react-hot-toast';

interface CertificateManagerProps {
    certificateId: number;
    currentStatus: CertificateStatus;
    onStatusUpdate?: () => void;
}

export default function CertificateManager({ 
    certificateId, 
    currentStatus, 
    onStatusUpdate 
}: CertificateManagerProps) {
    const { provider, account } = useWeb3();
    const [loading, setLoading] = useState(false);

    const handleStatusUpdate = async (newStatus: CertificateStatus) => {
        if (!provider || !account) {
            toast.error('请先连接钱包');
            return;
        }

        setLoading(true);
        try {
            // 准备新的IPFS数据
            const metadata = {
                status: newStatus,
                updatedAt: new Date().toISOString(),
                updatedBy: account
            };

            // 上传到IPFS
            const newIpfsHash = await ipfsService.uploadJSON(metadata);

            // 更新状态
            const tx = await updateCertificateStatus(
                provider,
                certificateId,
                newStatus,
                newIpfsHash
            );
            await tx.wait();

            toast.success('状态更新成功');
            onStatusUpdate?.();
        } catch (error) {
            console.error('更新状态失败:', error);
            toast.error('更新状态失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">证书状态管理</h3>
            <div className="grid grid-cols-1 gap-3">
                {Object.values(CertificateStatus)
                    .filter(status => typeof status === 'number')
                    .map((status: number) => (
                        <button
                            key={status}
                            onClick={() => handleStatusUpdate(status)}
                            disabled={loading || status <= currentStatus}
                            className="btn-primary disabled:opacity-50"
                        >
                            {loading ? '处理中...' : `更新为 ${CertificateStatus[status]}`}
                        </button>
                    ))}
            </div>
        </div>
    );
} 