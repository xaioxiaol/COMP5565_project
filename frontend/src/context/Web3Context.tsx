import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

interface Web3ContextType {
    provider: ethers.providers.Web3Provider | null;
    account: string;
    isConnected: boolean;
    connect: () => Promise<void>;
    disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType>({} as Web3ContextType);

export function Web3Provider({ children }: { children: ReactNode }) {
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [account, setAccount] = useState<string>('');
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);

            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', () => window.location.reload());
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }, []);

    const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
            disconnect();
        } else {
            setAccount(accounts[0]);
        }
    };

    const connect = async () => {
        try {
            if (!provider) {
                toast.error('请安装MetaMask钱包');
                return;
            }

            const accounts = await provider.send('eth_requestAccounts', []);
            setAccount(accounts[0]);
            setIsConnected(true);
            toast.success('钱包连接成功');
        } catch (error) {
            toast.error('连接钱包失败');
            console.error(error);
        }
    };

    const disconnect = () => {
        setAccount('');
        setIsConnected(false);
    };

    return (
        <Web3Context.Provider
            value={{
                provider,
                account,
                isConnected,
                connect,
                disconnect
            }}
        >
            {children}
        </Web3Context.Provider>
    );
}

export const useWeb3 = () => useContext(Web3Context); 