import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { PLAYER, PLAYER_STATS } from '../constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { execute } = deployments;

  const { deployer } = await getNamedAccounts();

  const player = await deployments.get(PLAYER);

  console.log('Setting setting player manager: ' + player.address);
  await execute(PLAYER_STATS, { from: deployer, log: true }, 'setPlayerManager', player.address);
};

export default func;

func.tags = [PLAYER_STATS];
