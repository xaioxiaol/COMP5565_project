export interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
    certificateId: string;
    uniqueId: string;
    batchCode: string;
    state: string;
    productionDate: string;
}

export const products: Product[] = [
    {
        id: "1",
        name: "钻石项链 - 永恒之心",
        description: "18K白金钻石项链，主石0.5克拉，净度VS，颜色D-F",
        price: "19999",
        image: "/images/diamond-necklace-1.jpg",
        certificateId: "CERT-001",
        uniqueId: "UN-001-2023",
        batchCode: "BATCH-001",
        state: "已售出",
        productionDate: "2023-12-01"
    },
    {
        id: "2",
        name: "钻石戒指 - 星光璀璨",
        description: "18K玫瑰金钻石戒指，主石1克拉，净度VVS，颜色D",
        price: "29999",
        image: "/images/diamond-ring-1.jpg",
        certificateId: "CERT-002",
        uniqueId: "UN-002-2023",
        batchCode: "BATCH-002",
        state: "已售出",
        productionDate: "2023-12-02"
    },
    {
        id: "3",
        name: "钻石手链 - 流光溢彩",
        description: "18K黄金钻石手链，总重3克拉，净度VS-SI，颜色G-H",
        price: "15999",
        image: "/images/diamond-bracelet-1.jpg",
        certificateId: "CERT-003",
        uniqueId: "UN-003-2023",
        batchCode: "BATCH-003",
        state: "已售出",
        productionDate: "2023-12-03"
    }
]; 