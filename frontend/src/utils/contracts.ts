import { ethers } from 'ethers';
import DiamondCertificateABI from '../contracts/DiamondCertificate.json';
import { CONFIG } from '@/config';

export async function getCertificateDetails(provider: ethers.providers.Web3Provider, certificateId: number) {
    try {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            CONFIG.CONTRACT_ADDRESS,
            DiamondCertificateABI.abi,
            signer
        );

        // 调用合约的 getCertificates 方法
        const records = await contract.getCertificates(certificateId.toString());
        
        if (!records || records.length === 0) {
            throw new Error('证书不存在');
        }

        return {
            ipfsHash: records[0],
            certificateId: certificateId
        };
    } catch (error) {
        console.error('获取证书详情失败:', error);
        throw error;
    }
}

export async function addCertificate(
    provider: ethers.providers.Web3Provider,
    uniqueId: string,
    ipfsHash: string
) {
    try {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            CONFIG.CONTRACT_ADDRESS,
            DiamondCertificateABI.abi,
            signer
        );

        const tx = await contract.addCertificate(uniqueId, ipfsHash);
        await tx.wait();

        return tx.hash;
    } catch (error) {
        console.error('添加证书失败:', error);
        throw error;
    }
}

export async function updateCertificateStatus(
    provider: ethers.providers.Web3Provider,
    certificateId: number,
    newStatus: number
) {
    try {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            CONFIG.CONTRACT_ADDRESS,
            DiamondCertificateABI.abi,
            signer
        );

        const tx = await contract.updateStatus(certificateId, newStatus);
        await tx.wait();

        return tx.hash;
    } catch (error) {
        console.error('更新证书状态失败:', error);
        throw error;
    }
}

export async function transferCertificate(
    provider: ethers.providers.Web3Provider,
    certificateId: number,
    newOwner: string
) {
    try {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            CONFIG.CONTRACT_ADDRESS,
            DiamondCertificateABI.abi,
            signer
        );

        const tx = await contract.transferCertificate(certificateId, newOwner);
        await tx.wait();

        return tx.hash;
    } catch (error) {
        console.error('转移证书失败:', error);
        throw error;
    }
} 