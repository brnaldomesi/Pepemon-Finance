import { BigNumber } from 'ethers';
import { DAI_OWNER, ME } from '../constants';

const oneEther = BigNumber.from(1).mul(BigNumber.from(10).pow(18));

const hre = require('hardhat');

async function main() {
  console.log('Starting...');
  const { ethers } = hre;

  console.log('Hijacking account with DAI');
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [DAI_OWNER],
  });

  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [ME],
  });

  console.log('Getting signer');
  let daiOwner = await hre.ethers.provider.getSigner(DAI_OWNER);

  console.log('Sending Eth to me');
  await daiOwner.sendTransaction({
    from: DAI_OWNER,
    value: oneEther.mul(4000),
    to: ME,
  });

  await daiOwner.sendTransaction({
    from: DAI_OWNER,
    value: oneEther.mul(4000),
    to: ME,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
