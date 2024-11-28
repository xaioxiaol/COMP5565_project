export const CONFIG = {
    // Hardhat 本地网络
    NETWORK: {
        chainId: '0x7A69', // 31337 in hex
        chainName: 'Hardhat Local',
        rpcUrls: ['http://127.0.0.1:8545'],
        nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18
        },
    },
    
    // 部署后从控制台输出获取
    CONTRACT_ADDRESS: '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0'
};

// Hardhat 测试账号
export const TEST_ACCOUNTS = {
    MINER: {
        address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'
    },
    CUTTER: {
        address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
        privateKey: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a'
    },
    CERTIFIER: {
        address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
        privateKey: '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6'
    },
    MANUFACTURER: {
        address: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
        privateKey: '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a'
    }
}; 