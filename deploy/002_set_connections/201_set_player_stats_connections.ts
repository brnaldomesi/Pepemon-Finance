import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { PLAYER_STATS, TRAINING } from '../constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { execute } = deployments;

  const { deployer } = await getNamedAccounts();

  const training = await deployments.get(TRAINING);

  console.log('Setting Training contract as Player Manager : ' + training.address);
  await execute(PLAYER_STATS, { from: deployer, log: true }, 'setPlayerManager', training.address);
};

export default func;

func.tags = [PLAYER_STATS];
