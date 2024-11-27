export function getCertificateStatus(status: number): string {
    switch (status) {
        case 0: return '待审核';
        case 1: return '已通过';
        case 2: return '已拒绝';
        default: return '未知状态';
    }
}