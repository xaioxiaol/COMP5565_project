import { ethers } from "ethers";
import { CONFIG } from "@/config";
import { ipfsService } from "@/utils/ipfs";
import AuditRecord from "@/types/AuditRecord";

export class AuditTrailController {
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
            throw new Error("MetaMask not installed. Please install and try again!");
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        return new ethers.Contract(this.contractAddress, this.abi, signer);
    }

    async addAuditRecord(auditData: { actorId: any; uniqueId: any; batchCode: any; role: any; }): Promise<void> {
        try {
            if (!auditData.actorId || !auditData.uniqueId || !auditData.batchCode || !auditData.role) {
                throw new Error("All fields are required!");
            }

            const fullAuditData = new AuditRecord(
                auditData.actorId,
                auditData.uniqueId,
                auditData.batchCode,
                auditData.role,
                new Date().toISOString()
            );

            const ipfsHash = await ipfsService.uploadJSON(fullAuditData.toJSON());

            const contract = await this.getContract();
            const tx = await contract.addAuditRecord(auditData.uniqueId, ipfsHash);

            console.log("Submitting transaction, please wait...", tx.hash);
            await tx.wait();
            console.log("Transaction complete, audit record added successfully!", tx.hash);
        } catch (error) {
            console.error("Failed to add audit record:", error);
            throw error;
        }
    }

    async getAuditRecord(uniqueId: string): Promise<AuditRecord> {
        try {
            if (!uniqueId) {
                throw new Error("Please enter Unique ID!");
            }

            const contract = await this.getContract();
            const records = await contract.getAuditRecords(uniqueId);

            if (!records || records.length === 0) {
                throw new Error("No records found");
            }

            const record = await ipfsService.getJSON(records[0]);
            return AuditRecord.fromJSON(JSON.parse(record));
        } catch (error) {
            console.error("Failed to get audit record:", error);
            throw error;
        }
    }

    async getAllAuditRecords(uniqueId: string): Promise<AuditRecord[]> {
        try {
            if (!uniqueId) {
                throw new Error("Please enter Unique ID!");
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
            console.error("Failed to get audit records:", error);
            throw error;
        }
    }
}

export const auditTrailController = new AuditTrailController();