import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { SHOP, TREASURY } from '../constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { execute } = deployments;

  const { deployer } = await getNamedAccounts();

  const shop = await deployments.get(SHOP);

  console.log('Setting Shop as Cash spender : ' + shop.address);
  await execute(TREASURY, { from: deployer, log: true }, 'setCashSpender', shop.address);
};

export default func;

func.tags = [TREASURY];
