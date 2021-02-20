import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import {
  PLAYER_STATS,
  SCHEME_SCROUNGE_FOR_SATOSHIS,
  SCHEME_TEST,
  SCHEME_YIELD_FARM,
  SCHEME_MANAGER,
} from '../../constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { execute } = deployments;

  const { deployer } = await getNamedAccounts();

  const playerStats = await deployments.get(PLAYER_STATS);

  console.log('Setting player stats for Yield Farm: ' + playerStats.address);
  await execute(SCHEME_YIELD_FARM, { from: deployer, log: true }, 'setPlayerStats', playerStats.address);

  console.log('Setting player stats for Scrounge For Satoshis: ' + playerStats.address);
  await execute(SCHEME_SCROUNGE_FOR_SATOSHIS, { from: deployer, log: true }, 'setPlayerStats', playerStats.address);

  console.log('Setting player stats for Test Scheme: ' + playerStats.address);
  await execute(SCHEME_TEST, { from: deployer, log: true }, 'setPlayerStats', playerStats.address);
};

export default func;

func.tags = [SCHEME_MANAGER];
