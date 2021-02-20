import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { SHOP, WEAPON_BASE } from '../constants';
import { BigNumber } from 'ethers';

export function deployCard(name: string, damageBoost: number, cost: BigNumber) {
  const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy, log, execute } = deployments;

    const { deployer } = await getNamedAccounts();

    log('Deploying ' + name + '...');
    const deployment = await deploy(WEAPON_BASE, {
      from: deployer,
      log: true,
      args: [name, name, damageBoost],
    });

    console.log('Adding ' + name + '  to shop: ' + deployment.address);
    await execute(SHOP, { from: deployer, log: true }, 'list', deployment.address, cost);

  };

  return func;
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {};

export default func;
