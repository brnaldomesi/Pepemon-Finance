import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import {
  SCHEME_MANAGER,
  SCHEME_SCROUNGE_FOR_SATOSHIS,
  SCHEME_TEST,
  SCHEME_YIELD_FARM,
  TREASURY,
} from '../../constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { execute } = deployments;

  const { deployer } = await getNamedAccounts();

  const treasury = await deployments.get(TREASURY);

  console.log('Setting player for Yield Farm: ' + treasury.address);
  await execute(SCHEME_YIELD_FARM, { from: deployer, log: true }, 'setTreasury', treasury.address);

  console.log('Setting player for Scrounge For Satoshis: ' + treasury.address);
  await execute(SCHEME_SCROUNGE_FOR_SATOSHIS, { from: deployer, log: true }, 'setTreasury', treasury.address);

  console.log('Setting player for Test Scheme: ' + treasury.address);
  await execute(SCHEME_TEST, { from: deployer, log: true }, 'setTreasury', treasury.address);
};

export default func;

func.tags = [SCHEME_MANAGER];
