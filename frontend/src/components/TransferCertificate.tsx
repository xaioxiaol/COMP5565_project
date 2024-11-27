import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '@/context/Web3Context';
import toast from 'react-hot-toast';

interface TransferCertificateProps {
    certificateId: number;
    onTransferComplete?: () => void;
}

export default function TransferCertificate({ certificateId, onTransferComplete }: TransferCertificateProps) {
    const { provider } = useWeb3();
    const [toAddress, setToAddress] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!provider || !ethers.utils.isAddress(toAddress)) {
            toast.error('请输入有效的接收地址');
            return;
        }

        setLoading(true);
        try {
            const contract = getContract(provider);
            const tx = await contract.transferCertificate(certificateId, toAddress);
            await tx.wait();
            
            toast.success('证书转让成功');
            setToAddress('');
            onTransferComplete?.();
        } catch (error) {
            console.error(error);
            toast.error('转让失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleTransfer} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    接收方地址
                </label>
                <input
                    type="text"
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    placeholder="0x..."
                    required
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
                {loading ? '转让中...' : '转让证书'}
            </button>
        </form>
    );
} 