import { BigNumber, Contract } from 'ethers';
import { STREAM_MANAGER } from '../../deploy/constants';
import { Deployment } from 'hardhat-deploy/dist/types';
import { ME } from '../constants';
import { wait } from '../../test/helpers/contract';

const hre = require('hardhat');

async function main() {
  console.log('Starting...');
  const { ethers } = hre;

  console.log('Getting signer');
  let me = await hre.ethers.provider.getSigner(ME);

  console.log('Connecting to Stream Manager');
  const streamManager = await hre.deployments.get(STREAM_MANAGER).then(async (deployment: Deployment) => {
    return await ethers.getContractAt(deployment.abi, deployment.address).then(async (contract: Contract) => {
      return contract.connect(me);
    });
  });

  await streamManager.blockTime().then((time: BigNumber) => {
    console.log(time.toNumber());
  });

  await hre.ethers.provider.send('evm_increaseTime', [7200]);
  await hre.ethers.provider.send('evm_mine', []);

  await streamManager.blockTime().then((time: BigNumber) => {
    console.log(time.toNumber());
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
