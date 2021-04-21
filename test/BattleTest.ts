import { deployDeckContract, deployBattleContract, getProvider } from './helpers/contract';
import { PepemonCard, PepemonCardDeck, PepemonBattle } from '../typechain';
import { PepemonFactory } from "../typechain/PepemonFactory";


import DeckArtifact from '../artifacts/contracts/PepemonCardDeck.sol/PepemonCardDeck.json';
import CardArtifact from '../artifacts/contracts/PepemonCard.sol/PepemonCard.json';
import BattleArtifact from '../artifacts/contracts/PepemonBattle.sol/PepemonBattle.json';

import { expect } from 'chai';
import { deployContract, deployMockContract, MockContract } from 'ethereum-waffle';
import { BigNumber } from 'ethers';

const [alice, bob] = getProvider().getWallets();

describe('Battle', () => {
  let battle: PepemonBattle;
  let deck: PepemonCardDeck | MockContract;
  // let card: PepemonCard | MockContract;
  let card: PepemonCard;

  beforeEach(async () => {
    // deck = await deployMockContract(alice, DeckArtifact.abi);
    deck = await deployDeckContract(alice);
    battle = await deployBattleContract(alice);
    // card = await deployMockContract(alice, CardArtifact.abi);
    card = (await deployContract(alice, CardArtifact)) as PepemonCard;

    // card
    // card.addBattleCard({
    //   battleCardId: 1,
    //   battleType: 1,
    //   hp: 400,
    //   spd: 5,
    //   inte: 6,
    //   def: 12,
    //   atk: 5,
    //   sAtk: 20,
    //   sDef: 12
    // });
    // card.addBattleCard({
    //   battleCardId: 2,
    //   battleType: 1,
    //   hp: 800,
    //   spd: 10,
    //   inte: 7,
    //   def: 24,
    //   atk: 10,
    //   sAtk: 40,
    //   sDef: 24
    // });
    // // deck
    // deck.createDeck();
    // deck.addBattleCardToDeck(1, 1);
  });

  it('Should allow a battle to be created', async () => {
    await battle.createBattle(alice.address, bob.address);
    await battle.battles(1).then((battle: any) => {
      expect(battle['battleId']).to.eq(1);
      expect(battle['p1']).to.eq(alice.address);
      expect(battle['p2']).to.eq(bob.address);
    });
    battle.addBattleCard({
      battleCardId: 2,
      battleType: 1,
      hp: 800,
      spd: 10,
      inte: 7,
      def: 24,
      atk: 10,
      sAtk: 40,
      sDef: 24
    });
  });

  it('Should allow a battle to be started', async () => {
    await battle.createBattle(alice.address, bob.address);
    // await battle.startBattle(1);
  });
});
