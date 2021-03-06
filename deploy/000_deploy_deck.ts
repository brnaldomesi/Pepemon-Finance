import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {DECK} from './constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {deployments, getNamedAccounts} = hre;
    const {deploy, log} = deployments;

    const {deployer} = await getNamedAccounts();

    log('Deploying Deck Contract from ' + deployer + "....");
    await deploy(DECK, {
      from: deployer,
      log: true,
    });
};

export default func;

func.tags = [DECK];
