import { ethers } from 'ethers';
import { DiamondCertificateContract } from '@/types/contracts';
import DiamondCertificateABI from '../contracts/DiamondCertificate.json';

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

export const ROLES = {
    MINER: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINER_ROLE")),
    CUTTER: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CUTTER_ROLE")),
    CERTIFIER: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CERTIFIER_ROLE")),
    MANUFACTURER: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MANUFACTURER_ROLE"))
};

export function getContract(provider: ethers.providers.Web3Provider): DiamondCertificateContract {
    const signer = provider.getSigner();
    return new ethers.Contract(
        CONTRACT_ADDRESS,
        DiamondCertificateABI,
        signer
    ) as DiamondCertificateContract;
}

export async function createCertificate(
    provider: ethers.providers.Web3Provider,
    ipfsHash: string
): Promise<ethers.ContractTransaction> {
    const contract = getContract(provider);
    return await contract.createCertificate(ipfsHash);
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
    
    return timestamps.map((timestamp, index) => ({
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