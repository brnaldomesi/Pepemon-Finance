import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

import { SCHEME_SCROUNGE_FOR_SATOSHIS } from '../constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;

  const { deployer } = await getNamedAccounts();

  const duration = 3600;
  const experience = 100;
  const chanceOfSuccess = 50;
  const baseEarning = 25;
  const earningBonus = 10;

  log('Deploying Scheme Yield Farm...');
  await deploy(SCHEME_SCROUNGE_FOR_SATOSHIS, {
    from: deployer,
    log: true,
    args: [duration, experience, chanceOfSuccess, baseEarning, earningBonus],
  });
};

export default func;

func.tags = [SCHEME_SCROUNGE_FOR_SATOSHIS];
