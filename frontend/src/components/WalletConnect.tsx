import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { CONFIG } from '@/config';

interface WalletConnectProps {
    onProviderSet?: (provider: ethers.providers.Web3Provider) => void;
}

export default function WalletConnect({ onProviderSet }: WalletConnectProps) {
    const [account, setAccount] = useState<string>('');
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

    const setupNetwork = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: CONFIG.NETWORK.chainId }],
            });
        } catch (switchError: any) {
            // 如果网络不存在，添加网络
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [CONFIG.NETWORK],
                    });
                } catch (addError) {
                    console.error('Failed to add network:', addError);
                }
            }
        }
    };

    const connectWallet = async () => {
        try {
            if (!provider) {
                toast.error('Please install MetaMask wallet');
                return;
            }

            // 确保连接到正确的网络
            await setupNetwork();

            const accounts = await provider.send('eth_requestAccounts', []);
            setAccount(accounts[0]);
            toast.success('Wallet connection successful');
        } catch (error) {
            console.error(error);
            toast.error('Failed to connect to wallet');
        }
    };

    useEffect(() => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);
            onProviderSet?.(provider);

            // 监听账号变化
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                } else {
                    setAccount('');
                }
            });

            // 监听链变化
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }
    }, [onProviderSet]);

    return (
        <div className="flex items-center justify-end p-4">
            {!account ? (
                <button
                    onClick={connectWallet}
                    className="btn-primary"
                >
                    Connect your wallet
                </button>
            ) : (
                <div className="text-sm text-gray-600">
                    {`${account.substring(0, 6)}...${account.substring(38)}`}
                </div>
            )}
        </div>
    );
} 