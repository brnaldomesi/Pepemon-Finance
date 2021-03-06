import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ACTION_CARD_ADDRESS, BATTLE_CARD_ADDRESS, DECK } from './constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { execute } = deployments;

  const { deployer } = await getNamedAccounts();

  console.log('Setting action card address: ' + ACTION_CARD_ADDRESS);
  await execute(DECK, { from: deployer, log: true }, 'setActionCardAddress', ACTION_CARD_ADDRESS);

  console.log('Setting battle card address: ' + BATTLE_CARD_ADDRESS);
  await execute(DECK, { from: deployer, log: true }, 'setBattleCardAddress', BATTLE_CARD_ADDRESS);
};

export default func;

func.tags = [DECK];
