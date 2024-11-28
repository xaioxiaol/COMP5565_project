import { ethers } from "ethers";
import { CONFIG } from "@/config";
import { ipfsService } from "@/utils/ipfs";
import Certificate from "@/types/Certificate";

export class CertificateController {
    private contractAddress: string;
    private abi: any[];

    constructor() {
        this.contractAddress = CONFIG.CONTRACT_ADDRESS;
        this.abi = [
            {
                inputs: [
                    {
                        internalType: "string",
                        name: "uniqueId",
                        type: "string",
                    },
                    {
                        internalType: "string",
                        name: "ipfsHash",
                        type: "string",
                    },
                ],
                name: "addCertificate",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function",
            },
            {
                inputs: [
                    {
                        internalType: "string",
                        name: "uniqueId",
                        type: "string",
                    },
                ],
                name: "getCertificates",
                outputs: [
                    {
                        internalType: "string[]",
                        name: "",
                        type: "string[]",
                    },
                ],
                stateMutability: "view",
                type: "function",
            },
        ];
    }

    private async getContract() {
        if (!window.ethereum) {
            throw new Error("MetaMask 未安装，请安装后重试！");
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        return new ethers.Contract(this.contractAddress, this.abi, signer);
    }

    private async generateCertificateId(certificateData: any): Promise<string> {
        return `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${certificateData.uniqueId}`;
    }

    private async signCertificate(certificate: any): Promise<string> {
        if (!window.ethereum) {
            throw new Error("MetaMask 未安装，请安装后重试！");
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        // const message = JSON.stringify(certificate);
        const message = JSON.stringify({
            uniqueId: certificate.uniqueId,
            batchCode: certificate.batchCode,
            state: certificate.state,
            price: certificate.price,
            description: certificate.description,
            productionDate: typeof certificate.productionDate === 'string'
                ? certificate.productionDate.split('T')[0]
                : certificate.productionDate.toISOString().split('T')[0],
        });
        console.log("message: " + message);
        return await signer.signMessage(message);
    }

    async addCertificate(certificateData: any): Promise<void> {
        console.log(certificateData);
        try {
            // Validate input data
            if (!certificateData.uniqueId || !certificateData.batchCode ||
                !certificateData.state || !certificateData.price ||
                !certificateData.description || !certificateData.productionDate) {
                throw new Error("所有字段都必须填写！");
            }

            // Generate certificate ID and signature
            const certificateId = await this.generateCertificateId(certificateData);
            const signature = await this.signCertificate(certificateData);

            // Create new Certificate instance
            const fullCertificate = new Certificate(
                certificateId,
                certificateData.uniqueId,
                certificateData.batchCode,
                certificateData.state,
                certificateData.price,
                certificateData.description,
                certificateData.productionDate,
                signature
            );

            // Upload to IPFS
            const ipfsHash = await ipfsService.uploadJSON(fullCertificate.toJSON());

            // Get contract and add certificate
            const contract = await this.getContract();
            const tx = await contract.addCertificate(certificateData.uniqueId, ipfsHash);

            console.log("正在提交交易，请稍后...", tx.hash);
            await tx.wait();
            console.log("交易完成，已成功添加证书！", tx.hash);
        } catch (error) {
            console.error("添加证书失败:", error);
            throw error;
        }
    }

    async getCertificate(uniqueId: string): Promise<Certificate> {
        try {
            if (!uniqueId) {
                throw new Error("请输入唯一 ID！");
            }

            const contract = await this.getContract();
            const records = await contract.getCertificates(uniqueId);

            if (!records || records.length === 0) {
                throw new Error("未找到相关证书");
            }

            const record = await ipfsService.getJSON(records[0]);
            return Certificate.fromJSON(JSON.parse(record));
        } catch (error) {
            console.error("获取证书失败:", error);
            throw error;
        }
    }

    async getAllCertificates(uniqueId: string): Promise<Certificate[]> {
        try {
            if (!uniqueId) {
                throw new Error("请输入唯一 ID！");
            }

            const contract = await this.getContract();
            const records = await contract.getCertificates(uniqueId);

            const certificates = await Promise.all(
                records.map(async (ipfsHash: string) => {
                    const record = await ipfsService.getJSON(ipfsHash);
                    return Certificate.fromJSON(JSON.parse(record));
                })
            );

            return certificates;
        } catch (error) {
            console.error("获取证书失败:", error);
            throw error;
        }
    }

    async verifyCertificate(certificate: Certificate): Promise<boolean> {
        console.log(certificate);
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
            const message = JSON.stringify({
                uniqueId: certificate.uniqueId,
                batchCode: certificate.batchCode,
                state: certificate.state,
                price: certificate.price,
                description: certificate.description,
                productionDate: typeof certificate.productionDate === 'string'
                    ? certificate.productionDate.split('T')[0]
                    : certificate.productionDate.toISOString().split('T')[0],
            });

            console.log("message: " + message);

            const recoveredAddress = ethers.utils.verifyMessage(message, certificate.signature);
            const signer = await provider.getSigner();
            const signerAddress = await signer.getAddress();

            return recoveredAddress.toLowerCase() === signerAddress.toLowerCase();
        } catch (error) {
            console.error("验证证书失败:", error);
            throw error;
        }
    }
}

export const certificateController = new CertificateController();
