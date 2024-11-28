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

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!provider) {
            toast.error('Please connect wallet first');
            return;
        }

        setLoading(true);
        try {
            // Upload metadata to IPFS
            const ipfsHash = await ipfsService.uploadJSON(certificateData);
            
            // Create certificate on blockchain
            const tx = await createCertificate(provider, ipfsHash);
            await tx.wait();
            
            toast.success('Certificate created successfully');
            
            // Reset form
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
            toast.error('Failed to create certificate');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-2xl mx-auto mt-8">
                <h1 className="text-2xl font-bold mb-6">Create Diamond Certificate</h1>
                
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
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
                        <label className="block text-sm font-medium text-gray-700">Description</label>
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
                            <label className="block text-sm font-medium text-gray-700">Carat</label>
                            <input
                                type="text"
                                name="attributes.carat"
                                value={certificateData.attributes.carat}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Color</label>
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
                        {loading ? 'Creating...' : 'Create Certificate'}
                    </button>
                </form>
            </div>
        </div>
    );
} 