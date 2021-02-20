import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { SHOP, TRAINING, TREASURY } from '../constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { execute } = deployments;

  const { deployer } = await getNamedAccounts();

  const treasury = await deployments.get(TREASURY);

  console.log('Connecting treasury to shop contract : ' + treasury.address);
  await execute(SHOP, { from: deployer, log: true }, 'setTreasuryContract', treasury.address);
};

export default func;

func.tags = [TRAINING];
