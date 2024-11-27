import toast from 'react-hot-toast';
import { ethers } from 'ethers';
import { CONFIG } from '@/config';
import DiamondCertificateArtifact from '../../../backend/artifacts/contracts/DiamondCertificate.sol/DiamondCertificate.json';

export function getContract(provider: ethers.providers.Web3Provider) {
    const signer = provider.getSigner();
    return new ethers.Contract(
        CONFIG.CONTRACT_ADDRESS,
        DiamondCertificateArtifact.abi,
        signer
    );
}

export async function createCertificate(
    provider: ethers.providers.Web3Provider,
    ipfsHash: string
): Promise<ethers.ContractTransaction> {
    const contract = getContract(provider);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    
    // 重置 nonce
    const nonce = await provider.getTransactionCount(address, 'latest');
    console.log('当前 nonce:', nonce);
    
    try {
        const tx = await contract.createCertificate(ipfsHash, {
            nonce: nonce,
            gasLimit: 500000 // 设置固定的 gas 限制
        });
        return tx;
    } catch (error: any) {
        console.error('创建证书错误:', error);
        if (error.code === 'NONCE_EXPIRED') {
            toast.error('交易 nonce 错误，请刷新页面重试');
        } else {
            toast.error('创建证书失败');
        }
        throw error;
    }
}

export async function updateCertificateStatus(
    provider: ethers.providers.Web3Provider,
    certificateId: number,
    newStatus: number,
    newIpfsHash: string
): Promise<ethers.ContractTransaction> {
    const contract = getContract(provider);
    return await contract.updateStatus(certificateId, newStatus, newIpfsHash);
}

export async function transferCertificate(
    provider: ethers.providers.Web3Provider,
    certificateId: number,
    to: string
): Promise<ethers.ContractTransaction> {
    const contract = getContract(provider);
    return await contract.transferCertificate(certificateId, to);
}

export async function getCertificateDetails(
    provider: ethers.providers.Web3Provider,
    certificateId: number
) {
    const contract = getContract(provider);
    const [currentOwner, ipfsHash, status, isTransferable] = 
        await contract.getCertificateDetails(certificateId);
    
    return {
        currentOwner,
        ipfsHash,
        status,
        isTransferable
    };
}

export async function getCertificateHistory(
    provider: ethers.providers.Web3Provider,
    certificateId: number
) {
    const contract = getContract(provider);
    const [timestamps, operators, statuses, ipfsHashes] = 
        await contract.getCertificateHistory(certificateId);
    
    return timestamps.map((timestamp: ethers.BigNumber, index: number) => ({
        timestamp: timestamp.toNumber(),
        operator: operators[index],
        status: statuses[index],
        ipfsHash: ipfsHashes[index]
    }));
}

export async function checkRole(
    provider: ethers.providers.Web3Provider,
    role: string,
    account: string
): Promise<boolean> {
    const contract = getContract(provider);
    return await contract.hasRole(role, account);
}

export async function grantManufacturerRole(
    provider: ethers.providers.Web3Provider,
    address: string
): Promise<ethers.ContractTransaction> {
    const contract = getContract(provider);
    const MANUFACTURER_ROLE = await contract.MANUFACTURER_ROLE();
    return contract.grantRole(MANUFACTURER_ROLE, address);
} 