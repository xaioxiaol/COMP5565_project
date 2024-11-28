import { ethers } from "ethers";
import { CONFIG } from "@/config";
import { ipfsService } from "@/utils/ipfs";
import AuditRecord from "@/types/AuditRecord";

export class AuditTrailController {
    private contractAddress: string;
    private abi: any[];

    constructor() {
        this.contractAddress = CONFIG.CONTRACT_ADDRESS;
        this.abi = this.abi = [
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
                name: "addAuditRecord",
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
                name: "getAuditRecords",
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

    async addAuditRecord(auditData: { actorId: any; uniqueId: any; batchCode: any; role: any; }): Promise<void> {
        try {
            // Validate input data
            if (!auditData.actorId || !auditData.uniqueId || !auditData.batchCode || !auditData.role) {
                throw new Error("所有字段都必须填写！");
            }

            // Create new AuditRecord instance
            const fullAuditData = new AuditRecord(
                auditData.actorId,
                auditData.uniqueId,
                auditData.batchCode,
                auditData.role,
                new Date().toISOString()
            );

            // Upload to IPFS
            const ipfsHash = await ipfsService.uploadJSON(fullAuditData.toJSON());

            // Get contract and add record
            const contract = await this.getContract();
            const tx = await contract.addAuditRecord(auditData.uniqueId, ipfsHash);

            console.log("正在提交交易，请稍后...", tx.hash);
            await tx.wait();
            console.log("交易完成，已成功添加审计记录！", tx.hash);
        } catch (error) {
            console.error("添加审计记录失败:", error);
            throw error;
        }
    }

    async getAuditRecord(uniqueId: string): Promise<AuditRecord> {
        try {
            if (!uniqueId) {
                throw new Error("请输入唯一 ID！");
            }

            const contract = await this.getContract();
            const records = await contract.getAuditRecords(uniqueId);

            if (!records || records.length === 0) {
                throw new Error("未找到相关记录");
            }

            const record = await ipfsService.getJSON(records[0]);
            return AuditRecord.fromJSON(JSON.parse(record));
        } catch (error) {
            console.error("获取审计记录失败:", error);
            throw error;
        }
    }

    async getAllAuditRecords(uniqueId: string): Promise<AuditRecord[]> {
        try {
            if (!uniqueId) {
                throw new Error("请输入唯一 ID！");
            }

            const contract = await this.getContract();
            const records = await contract.getAuditRecords(uniqueId);

            const auditRecords = await Promise.all(
                records.map(async (ipfsHash: string) => {
                    const record = await ipfsService.getJSON(ipfsHash);
                    return AuditRecord.fromJSON(JSON.parse(record));
                })
            );

            return auditRecords;
        } catch (error) {
            console.error("获取审计记录失败:", error);
            throw error;
        }
    }
}

export const auditTrailController = new AuditTrailController();