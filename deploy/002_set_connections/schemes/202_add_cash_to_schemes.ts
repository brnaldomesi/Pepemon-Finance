import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { CASH, SCHEME_SCROUNGE_FOR_SATOSHIS, SCHEME_TEST, SCHEME_YIELD_FARM, SCHEME_MANAGER } from '../../constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { execute } = deployments;

  const { deployer } = await getNamedAccounts();

  const cash = await deployments.get(CASH);

  console.log('Setting cash for Yield Farm: ' + cash.address);
  await execute(SCHEME_YIELD_FARM, { from: deployer, log: true }, 'setCashContract', cash.address);

  console.log('Setting cash for Scrounge For Satoshis: ' + cash.address);
  await execute(SCHEME_SCROUNGE_FOR_SATOSHIS, { from: deployer, log: true }, 'setCashContract', cash.address);

  console.log('Setting cash for Test Scheme: ' + cash.address);
  await execute(SCHEME_TEST, { from: deployer, log: true }, 'setCashContract', cash.address);
};

export default func;

func.tags = [SCHEME_MANAGER];
