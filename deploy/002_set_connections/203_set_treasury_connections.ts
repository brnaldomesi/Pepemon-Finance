import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { CASH, SHOP, TRAINING, TREASURY } from '../constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { execute } = deployments;

  const { deployer } = await getNamedAccounts();

  const cash = await deployments.get(CASH);

  console.log('Connecting Cash to Treasury contract : ' + cash.address);
  await execute(TREASURY, { from: deployer, log: true }, 'setCashAddress', cash.address);
};

export default func;

func.tags = [TRAINING];
