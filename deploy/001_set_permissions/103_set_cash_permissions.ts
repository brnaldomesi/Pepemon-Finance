import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { CASH, PLAYER_STATS, SCHEME_SCROUNGE_FOR_SATOSHIS, SCHEME_TEST, SCHEME_YIELD_FARM } from '../constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { execute } = deployments;

  const { deployer } = await getNamedAccounts();

  const scroungeForSatoshis = await deployments.get(SCHEME_SCROUNGE_FOR_SATOSHIS);
  const testScheme = await deployments.get(SCHEME_TEST);
  const yieldFarm = await deployments.get(SCHEME_YIELD_FARM);

  console.log('Setting Scrounge for Satoshis as Cash minter : ' + scroungeForSatoshis.address);
  await execute(CASH, { from: deployer, log: true }, 'setCashMinter', scroungeForSatoshis.address);

  console.log('Setting Test Scheme as Cash minter : ' + testScheme.address);
  await execute(CASH, { from: deployer, log: true }, 'setCashMinter', testScheme.address);

  console.log('Setting Yield Farm as Cash minter : ' + yieldFarm.address);
  await execute(CASH, { from: deployer, log: true }, 'setCashMinter', yieldFarm.address);
};

export default func;

func.tags = [PLAYER_STATS];
