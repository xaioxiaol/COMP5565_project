import { useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { updateStatus } from '@/utils/contracts';
import toast from 'react-hot-toast';

interface UpdateStatusProps {
    certificateId: number;
    currentStatus: number;
    onStatusUpdate?: () => void;
}

export default function UpdateStatus({ certificateId, currentStatus, onStatusUpdate }: UpdateStatusProps) {
    const { provider } = useWeb3();
    const [loading, setLoading] = useState(false);

    const handleStatusUpdate = async (newStatus: number) => {
        if (!provider) {
            toast.error('请先连接钱包');
            return;
        }

        setLoading(true);
        try {
            const tx = await updateStatus(provider, certificateId, newStatus);
            await tx.wait();
            toast.success('状态更新成功');
            onStatusUpdate?.();
        } catch (error) {
            console.error(error);
            toast.error('状态更新失败');
        } finally {
            setLoading(false);
        }
    };

    const nextStatus = currentStatus + 1;
    const statusLabels = [
        '开采完成',
        '切割完成',
        '质量认证完成',
        '珠宝制作完成',
        '售出'
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">更新状态</h3>
            {currentStatus < 5 && (
                <button
                    onClick={() => handleStatusUpdate(nextStatus)}
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50"
                >
                    {loading ? '更新中...' : `标记为${statusLabels[currentStatus]}`}
                </button>
            )}
        </div>
    );
} 