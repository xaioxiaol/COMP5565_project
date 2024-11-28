import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function ConnectWallet() {
    const [account, setAccount] = useState<string | null>(null);

    const connectWallet = async () => {
        try {
            if (typeof window.ethereum === 'undefined') {
                throw new Error('Please install MetaMask first!');
            }

            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            setAccount(accounts[0]);

        } catch (error) {
            console.error('Failed to connect wallet:', error);
        }
    };

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_accounts' })
                .then(accounts => {
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                    }
                });
        }
    }, []);

    return (
        <div>
            {account ? (
                <div>Connected: {account.slice(0, 6)}...{account.slice(-4)}</div>
            ) : (
                <button onClick={connectWallet}>Connect Wallet</button>
            )}
        </div>
    );
} 