import { ethers } from "ethers";
import { CONFIG } from "@/config";
import Ownership from '@/types/Ownership';
import { ipfsService } from "@/utils/ipfs";

export class OwnershipController {
    private contractAddress: string;
    private abi: any[];

    constructor() {
        this.contractAddress = CONFIG.CONTRACT_ADDRESS;
        this.abi = [
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "uniqueId",
                        "type": "string"
                    }
                ],
                "name": "getOwnerships",
                "outputs": [
                    {
                        "internalType": "string[]",
                        "name": "",
                        "type": "string[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "uniqueId",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "ipfsHash",
                        "type": "string"
                    }
                ],
                "name": "addOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
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

    async transferOwnership(uniqueId: string, newOwner: Ownership): Promise<void> {
        try {
            if (!uniqueId || !newOwner.ownerId) {
                throw new Error("所有字段都必须填写！");
            }
            const ipfsHash = await ipfsService.uploadJSON(newOwner.toJSON());
            const contract = await this.getContract();
            const tx = await contract.addOwnership(uniqueId, ipfsHash);

            console.log("正在转移所有权，请稍后...", tx.hash);
            await tx.wait();
            console.log("所有权转移成功！", tx.hash);
        } catch (error) {
            console.error("转移所有权失败:", error);
            throw error;
        }
    }

    async getCurrentOwner(uniqueId: string): Promise<string> {
        try {
            if (!uniqueId) {
                throw new Error("请输入唯一 ID！");
            }

            const contract = await this.getContract();
            const cids = await contract.getOwnerships(uniqueId);
            
            // 如果没有找到任何记录，返回空字符串而不是抛出错误
            if (!cids || cids.length === 0) {
                return "";
            }

            // 获取最新的所有权记录
            const latestCid = cids[cids.length - 1];
            const record = await ipfsService.getJSON(latestCid);
            console.log("ownership:" + JSON.stringify(record));
            const ownership = Ownership.fromJSON(JSON.parse(record));

            console.log("ownership:" + JSON.stringify(ownership));

            if (!ownership) {
                return "";
            }

            return ownership.ownerId;
        } catch (error) {
            console.error("获取当前所有者失败:", error);
            throw new Error("获取所有者信息失败，请稍后重试");
        }
    }

    async getOwnershipHistory(uniqueId: string): Promise<Ownership[]> {
        try {
            if (!uniqueId) {
                throw new Error("请输入唯一 ID！");
            }

            const contract = await this.getContract();
            const ownerships = await contract.getOwnerships(uniqueId);
            console.log("history:" + ownerships);

            // 转换并排序所有权历史记录
            return ownerships
                .map((ownership: { owner: string; timestamp: { toNumber: () => number } }) => ({
                    owner: ownership.owner,
                    timestamp: ownership.timestamp.toNumber()
                }))
                .sort((a: Ownership, b: Ownership) => b.transactionDate - a.transactionDate);
        } catch (error) {
            console.error("获取所有权历史失败:", error);
            throw error;
        }
    }
}

export const ownershipController = new OwnershipController();
