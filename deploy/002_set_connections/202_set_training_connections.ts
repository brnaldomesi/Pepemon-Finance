import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { PLAYER_STATS, TRAINING } from '../constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { execute } = deployments;

  const { deployer } = await getNamedAccounts();

  const playerStats = await deployments.get(PLAYER_STATS);

  console.log('Connecting player stats to training contract : ' + playerStats.address);
  await execute(TRAINING, { from: deployer, log: true }, 'setPlayerStats', playerStats.address);
};

export default func;

func.tags = [TRAINING];
