import { ethers } from 'ethers';

export enum CertificateStatus {
    Created,
    Mined,
    Cut,
    Certified,
    Manufactured,
    Sold
}

export interface Certificate {
    id: number;
    currentOwner: string;
    ipfsHash: string;
    status: CertificateStatus;
    isTransferable: boolean;
}

export interface CertificateHistory {
    timestamp: number;
    operator: string;
    status: CertificateStatus;
    ipfsHash: string;
}

export interface DiamondCertificateContract extends ethers.Contract {
    createCertificate(ipfsHash: string): Promise<ethers.ContractTransaction>;
    updateStatus(
        certificateId: number, 
        newStatus: CertificateStatus, 
        newIpfsHash: string
    ): Promise<ethers.ContractTransaction>;
    transferCertificate(
        certificateId: number, 
        to: string
    ): Promise<ethers.ContractTransaction>;
    getCertificateDetails(certificateId: number): Promise<[
        string,  // currentOwner
        string,  // ipfsHash
        number,  // status
        boolean  // isTransferable
    ]>;
    getCertificateHistory(certificateId: number): Promise<[
        number[],   // timestamps
        string[],   // operators
        number[],   // statuses
        string[]    // ipfsHashes
    ]>;
    hasRole(role: string, account: string): Promise<boolean>;
} 