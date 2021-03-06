import {deployContract, MockProvider} from 'ethereum-waffle';
import DeckArtifact from '../../artifacts/contracts/Deck.sol/Deck.json';

import {Signer} from 'ethers';
import {Deck} from '../../typechain';

let provider: MockProvider;

export function getProvider() {
  if (provider == undefined) {
    provider = new MockProvider();
  }
  return provider;
}


export async function deployDeckContract(signer: Signer) {
  return (await deployContract(signer, DeckArtifact)) as Deck;
}

export async function mineBlock() {
  await getProvider().send('evm_mine', []);
}

export async function wait(secondsToWait: number) {
  // Update the clock
  await getProvider().send('evm_increaseTime', [secondsToWait]);

  // Process the block
  await mineBlock();
}

export async function getBlockTime() {
  return await getProvider()
    .getBlock(getBlockNumber())
    .then((block) => block.timestamp);
}

export async function getBlockNumber() {
  return await getProvider().getBlockNumber();
}
