import { ethers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../config/contract';

export function getContract(provider: ethers.providers.Provider) {
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}