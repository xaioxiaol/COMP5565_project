import { useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { createCertificate, updateStatus } from '@/utils/contracts';
import { uploadToIPFS } from '@/utils/ipfs';
import toast from 'react-hot-toast';
import { CertificateMetadata, IPFSResponse } from '@/types/certificate';
import { ipfsService } from '@/utils/ipfs';

export default function ManagePage() {
    const { provider, account } = useWeb3();
    const [loading, setLoading] = useState(false);
    const [certificateData, setCertificateData] = useState({
        name: '',
        description: '',
        attributes: {
            carat: '',
            color: '',
            clarity: '',
            cut: ''
        }
    });
    const [certificateImages, setCertificateImages] = useState({
        main: null
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setCertificateData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent as keyof typeof prev],
                    [child]: value
                }
            }));
        } else {
            setCertificateData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!provider) {
            toast.error('请先连接钱包');
            return;
        }

        setLoading(true);
        try {
            // 检查网络
            const network = await provider.getNetwork();
            console.log('当前网络:', network);
            
            if (network.chainId !== 31337) { // Hardhat 的 chainId
                toast.error('请切换到本地测试网络');
                return;
            }

            // 上传图片到IPFS
            const imageFile = certificateImages.main;
            let imageHash = '';
            if (imageFile) {
                imageHash = await ipfsService.uploadFile(imageFile);
            }

            // 准备证书元数据
            const metadata: CertificateMetadata = {
                name: certificateData.name,
                description: certificateData.description,
                attributes: {
                    ...certificateData.attributes,
                    manufacturingDate: new Date().toISOString()
                },
                images: {
                    main: imageHash
                }
            };

            // 上传元数据到IPFS
            const ipfsHash = await ipfsService.uploadJSON(metadata);
            
            // 创建区块链上的证书
            const tx = await createCertificate(provider, ipfsHash);
            await tx.wait();
            
            toast.success('证书创建成功');
            // 重置表单
            setCertificateData({
                name: '',
                description: '',
                attributes: {
                    carat: '',
                    color: '',
                    clarity: '',
                    cut: ''
                }
            });
        } catch (error) {
            console.error(error);
            toast.error('创建失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-2xl mx-auto mt-8">
                <h1 className="text-2xl font-bold mb-6">创建钻石证书</h1>
                
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">名称</label>
                        <input
                            type="text"
                            name="name"
                            value={certificateData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">描述</label>
                        <textarea
                            name="description"
                            value={certificateData.description}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">克拉</label>
                            <input
                                type="text"
                                name="attributes.carat"
                                value={certificateData.attributes.carat}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">颜色</label>
                            <input
                                type="text"
                                name="attributes.color"
                                value={certificateData.attributes.color}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? '创建中...' : '创建证书'}
                    </button>
                </form>
            </div>
        </div>
    );
} 