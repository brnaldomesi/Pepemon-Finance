import { deployDeckContract, getProvider } from '../helpers/contract';
import { Deck, Pepemon } from '../../typechain';
import PepemonArtifact from '../../artifacts/contracts/Pepemon.sol/Pepemon.json';

import { expect } from 'chai';
import { deployMockContract, MockContract } from 'ethereum-waffle';

const [alice, bob] = getProvider().getWallets();

describe('Deck', () => {
  let deck: Deck;
  let bobSignedDeck: Deck;
  let battleCard: Pepemon | MockContract;

  beforeEach(async () => {
    deck = await deployDeckContract(alice);
    bobSignedDeck = await deck.connect(bob);
    battleCard = await deployMockContract(alice, PepemonArtifact.abi);

    await deck.setBattleCardAddress(battleCard.address);

    await battleCard.mock.ownerOf.withArgs(1).returns(alice.address);
  });

  it('Should allow a deck to be created', async () => {
    await deck.createDeck();

    await deck.ownerOf(1).then(ownerAddress => {
      expect(ownerAddress).to.eq(alice.address);
    });
  });

  describe('Battle card', async () => {
    beforeEach(async () => {
      await deck.createDeck();

    });

    it('Should allow adding a Battle Card to the deck', async () => {
      await battleCard.mock.transferFrom.withArgs(alice.address, deck.address, 1).returns();

      await deck.addBattleCard(1, 1);

      await deck.decks(1).then((deck: any) => {
        expect(deck).to.eq(1);
      });
    });

    it('Should return the previous battle card if one has been supplied', async () => {
      // Mock deposit transfer
      await battleCard.mock.transferFrom.withArgs(alice.address, deck.address, 1).returns();
      await battleCard.mock.transferFrom.withArgs(alice.address, deck.address, 2).returns();

      await battleCard.mock.ownerOf.withArgs(2).returns(alice.address);

      // Mock withdrawal transfer
      await battleCard.mock.transferFrom.withArgs(deck.address, alice.address, 1).returns();

      await deck.addBattleCard(1, 1);
      await deck.addBattleCard(1, 2);
    });
    describe('Permissions', async () => {
      it('Should prevent adding cards which you don\'t own', async () => {
        await battleCard.mock.transferFrom.withArgs(alice.address, deck.address, 1).returns();

        await expect(bobSignedDeck.addBattleCard(1, 1)).to.be.revertedWith("revert Not your card");
      });
    });
  });


  describe('Permissions', async () => {
    it('Should prevent anyone but the owner from setting the Battle Card address', async () => {
      await expect(bobSignedDeck.setBattleCardAddress(bob.address)).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('Should prevent anyone but the owner from setting the Action Card address', async () => {
      await expect(bobSignedDeck.setActionCardAddress(bob.address)).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

});
