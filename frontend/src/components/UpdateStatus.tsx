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
            toast.error('Please connect wallet first');
            return;
        }

        setLoading(true);
        try {
            const tx = await updateStatus(provider, certificateId, newStatus);
            await tx.wait();
            toast.success('Status updated successfully');
            onStatusUpdate?.();
        } catch (error) {
            console.error(error);
            toast.error('Status update failed');
        } finally {
            setLoading(false);
        }
    };

    const nextStatus = currentStatus + 1;
    const statusLabels = [
        'Mining Complete',
        'Cutting Complete',
        'Quality Certification Complete',
        'Jewelry Making Complete',
        'Sold'
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Update Status</h3>
            {currentStatus < 5 && (
                <button
                    onClick={() => handleStatusUpdate(nextStatus)}
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50"
                >
                    {loading ? 'Updating...' : `Mark as ${statusLabels[currentStatus]}`}
                </button>
            )}
        </div>
    );
} 