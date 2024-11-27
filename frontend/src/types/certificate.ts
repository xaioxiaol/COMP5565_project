export interface CertificateMetadata {
    name: string;
    description: string;
    attributes: {
        carat?: string;
        color?: string;
        clarity?: string;
        cut?: string;
        serialNumber?: string;
        manufacturingDate?: string;
        [key: string]: any;
    };
    images?: {
        main?: string;
        additional?: string[];
    };
    documents?: {
        certification?: string;
        warranty?: string;
        [key: string]: any;
    };
}

export interface IPFSResponse {
    path: string;
    size: number;
    cid: string;
} 