import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';

const ipfs = create({
    host: 'localhost',
    port: 5001,
    protocol: 'http'
});

export const ipfsService = {
    async uploadFile(file: File): Promise<string> {
        try {
            const buffer = Buffer.from(await file.arrayBuffer());
            const result = await ipfs.add(buffer);
            return result.path;
        } catch (error) {
            console.error('IPFS upload error:', error);
            throw error;
        }
    },

    async uploadJSON(data: any): Promise<string> {
        try {
            const buffer = Buffer.from(JSON.stringify(data));
            const result = await ipfs.add(buffer);
            // 返回的数据包含 CID 和其他元数据
            console.log('IPFS 返回值:', result);
            console.log('CID:', result.cid.toString());
            const cid = result.cid.toString();
            return cid;

        } catch (error) {
            console.error('IPFS upload error:', error);
            throw error;
        }
    },

    async getJSON(cid: string): Promise<string> {
        try {
            // 用于存储从 IPFS 中读取的数据块
            const dataChunks = [];

            // 从 IPFS 获取数据并逐块读取
            for await (const chunk of ipfs.cat(cid)) {
                dataChunks.push(chunk);
            }

            // 合并所有数据块成为完成的数据 (Buffer 或 JSON String)
            const completeData = Buffer.concat(dataChunks).toString();

            // console.log('从 IPFS 获取到的数据:', completeData);

            return completeData; // 返回完整数据
        } catch (error) {
            console.error('从 IPFS 获取数据失败:', error);
            throw error; // 抛出错误
        }
    },

    getGatewayURL(hash: string): string {
        return `http://localhost:8080/ipfs/${hash}`;
    }
}; 