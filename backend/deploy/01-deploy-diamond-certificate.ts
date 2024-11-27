import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Deploying contracts with the account:", deployer);

  const diamondCertificate = await deploy('DiamondCertificate', {
    from: deployer,
    args: [],
    log: true,
  });

  console.log("DiamondCertificate deployed to:", diamondCertificate.address);
};

export default func;
func.tags = ['DiamondCertificate']; 