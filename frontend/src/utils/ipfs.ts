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
            return result.path;
        } catch (error) {
            console.error('IPFS upload error:', error);
            throw error;
        }
    },

    async getJSON(hash: string): Promise<any> {
        try {
            const stream = ipfs.cat(hash);
            const chunks = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);
            return JSON.parse(buffer.toString());
        } catch (error) {
            console.error('IPFS download error:', error);
            throw error;
        }
    },

    getGatewayURL(hash: string): string {
        return `http://localhost:8080/ipfs/${hash}`;
    }
}; 