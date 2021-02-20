import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

import { SCHEME_MANAGER } from '../constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;

  const { deployer } = await getNamedAccounts();

  log('Deploying Schemes manager...');
  await deploy(SCHEME_MANAGER, {
    from: deployer,
    log: true,
  });
};

export default func;

func.tags = [SCHEME_MANAGER];
