// import { deployDeckContract, getProvider } from './helpers/contract';
// import { CardBase, Deck, Battle } from '../typechain';
// import PepemonArtifact from '../artifacts/contracts/Pepemon.sol/Pepemon.json';
// import ActionCardArtifact from '../artifacts/contracts/CardBase.sol/CardBase.json';
// import DeckArtifact from '../artifacts/contracts/Deck.sol/Deck.json';
// import BattleArtifact from '../artifacts/contracts/Battle.sol/Battle.json';
//
// import { expect } from 'chai';
// import { deployContract, deployMockContract, MockContract } from 'ethereum-waffle';
// import { BigNumber } from 'ethers';
//
// const [alice, bob] = getProvider().getWallets();
//
// describe('Battle', () => {
//   let battle: Battle;
//   let deck: Deck | MockContract;
//
//   beforeEach(async () => {
//     deck = await deployMockContract(alice, DeckArtifact.abi);
//
//     battle = (await deployContract(alice, BattleArtifact, [deck.address])) as Battle;
//   });
//
//   it('Should fetch the cards of a deck', async () => {
//     await deck.mock.decks.withArgs(1).returns({
//       "battleCardId": 1
//     });
//
//     await battle.getActionCards(1).then(console.log);
//   });
// });
