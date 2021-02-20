import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

import { SCHEME_TEST } from '../constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;

  const { deployer } = await getNamedAccounts();

  const duration = 10;
  const experience = 100;
  const chanceOfSuccess = 50;
  const baseEarning = 25;
  const earningBonus = 10;

  log('Deploying Test Scheme...');
  await deploy(SCHEME_TEST, {
    from: deployer,
    log: true,
    args: [duration, experience, chanceOfSuccess, baseEarning, earningBonus],
  });
};

export default func;

func.tags = [SCHEME_TEST];
