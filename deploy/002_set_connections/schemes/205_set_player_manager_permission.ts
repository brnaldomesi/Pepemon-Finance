import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { PLAYER_STATS, SCHEME_SCROUNGE_FOR_SATOSHIS, SCHEME_TEST, SCHEME_YIELD_FARM } from '../../constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { execute } = deployments;

  const { deployer } = await getNamedAccounts();

  const yieldFarm = await deployments.get(SCHEME_YIELD_FARM);
  const scroungeForSatoshis = await deployments.get(SCHEME_SCROUNGE_FOR_SATOSHIS);
  const testScheme = await deployments.get(SCHEME_TEST);

  console.log('Setting setting Yield Farm as player manager: ' + yieldFarm.address);
  await execute(PLAYER_STATS, { from: deployer, log: true }, 'setPlayerManager', yieldFarm.address);

  console.log('Setting setting Scrounge For Satoshis as player manager: ' + scroungeForSatoshis.address);
  await execute(PLAYER_STATS, { from: deployer, log: true }, 'setPlayerManager', scroungeForSatoshis.address);

  console.log('Setting setting Test Scheme as player manager: ' + scroungeForSatoshis.address);
  await execute(PLAYER_STATS, { from: deployer, log: true }, 'setPlayerManager', testScheme.address);
};

export default func;

func.tags = [PLAYER_STATS];
