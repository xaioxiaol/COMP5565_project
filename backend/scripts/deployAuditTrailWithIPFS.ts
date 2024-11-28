import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const MainContract = await ethers.getContractFactory("AuditTrailWithIPFS");
  const contract = await MainContract.deploy();

  const deployTx = contract.deploymentTransaction();
  if (!deployTx) throw new Error("Deployment transaction failed");
  
  console.log("Deploy transaction hash:", deployTx.hash);

  // 等待区块确认部署
  const receipt = await deployTx.wait();
  console.log("Contract deployed at:", await contract.getAddress());
  console.log("Transaction receipt:", receipt);
}

main().catch((err) => console.error(err));
