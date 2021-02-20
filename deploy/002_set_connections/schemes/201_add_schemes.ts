import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { SCHEME_SCROUNGE_FOR_SATOSHIS, SCHEME_TEST, SCHEME_YIELD_FARM, SCHEME_MANAGER } from '../../constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { execute } = deployments;

  const { deployer } = await getNamedAccounts();

  const yieldFarm = await deployments.get(SCHEME_YIELD_FARM);
  const scroungeForSatoshis = await deployments.get(SCHEME_SCROUNGE_FOR_SATOSHIS);
  const testScheme = await deployments.get(SCHEME_TEST);

  console.log('Setting setting Yield Farm as scheme: ' + yieldFarm.address);
  await execute(SCHEME_MANAGER, { from: deployer, log: true }, 'addScheme', yieldFarm.address);

  console.log('Setting setting Scrounge For Satoshis as scheme: ' + scroungeForSatoshis.address);
  await execute(SCHEME_MANAGER, { from: deployer, log: true }, 'addScheme', scroungeForSatoshis.address);

  console.log('Setting setting Test Scheme as scheme: ' + scroungeForSatoshis.address);
  await execute(SCHEME_MANAGER, { from: deployer, log: true }, 'addScheme', testScheme.address);
};

export default func;

func.tags = [SCHEME_MANAGER];
