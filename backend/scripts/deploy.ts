import { ethers } from "hardhat";

async function main() {
    const DiamondCertificate = await ethers.getContractFactory("DiamondCertificate");
    const contract = await DiamondCertificate.deploy();
    await contract.deployed();
    
    // 授予制造商角色
    const MANUFACTURER_ROLE = await contract.MANUFACTURER_ROLE();
    await contract.grantRole(MANUFACTURER_ROLE, '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65');
    
    console.log("DiamondCertificate deployed to:", contract.address);
}