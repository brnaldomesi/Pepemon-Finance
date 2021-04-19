import { deployDeckContract, getProvider } from '../helpers/contract';
import { PepemonCard, PepemonCardDeck } from '../../typechain';
import { PepemonFactory } from "../../typechain/PepemonFactory";
import PepemonFactoryArtifact from '../../contracts/abi/PepemonFactory.json';

import { expect } from 'chai';
import { deployMockContract, MockContract } from 'ethereum-waffle';
import { BigNumber } from 'ethers';

const [alice, bob] = getProvider().getWallets();

describe('Deck', () => {
  let deck: PepemonCardDeck;
  let bobSignedDeck: PepemonCardDeck;
  let battleCard: PepemonFactory | MockContract;
  let supportCard: PepemonFactory | MockContract;
  // let card: PepemonCard | MockContract;

  beforeEach(async () => {
    deck = await deployDeckContract(alice);
    bobSignedDeck = deck.connect(bob);
    // card = await deployMockContract(alice, PepemonFactoryArtifact);
    battleCard = await deployMockContract(alice, PepemonFactoryArtifact);
    supportCard = await deployMockContract(alice, PepemonFactoryArtifact);

    await deck.setBattleCardAddress(battleCard.address);
    await deck.setSupportCardAddress(supportCard.address);

    await battleCard.mock.balanceOf.withArgs(alice.address, 1).returns(1);
  });

  describe('Deck', async () => {
    it('Should allow a deck to be created', async () => {
      await deck.createDeck();

      await deck.ownerOf(1).then((ownerAddress: string) => {
          expect(ownerAddress).to.eq(alice.address);
      });
    });
  });

  describe('Battle card', async () => {
    beforeEach(async () => {
      await deck.createDeck();
      await battleCard.mock.safeTransferFrom.withArgs(alice.address, deck.address, 1, 1, "0x").returns();
      await battleCard.mock.balanceOf.withArgs(alice.address, 1).returns(1);
    });

    it('Should allow adding a Battle Card to the deck', async () => {
      await deck.addBattleCardToDeck(1, 1);
      await deck.decks(1).then((deck: any) => {
          expect(deck['battleCardId']).to.eq(1);
      });
    });

    it('Should return the previous battle card if one has already been supplied', async () => {
        // Mock deposit transfer
      await battleCard.mock.safeTransferFrom.withArgs(alice.address, deck.address, 1, 1, "0x").returns();
      await battleCard.mock.safeTransferFrom.withArgs(alice.address, deck.address, 2, 1, "0x").returns();

      // Mock balance
      await battleCard.mock.balanceOf.withArgs(alice.address, 1).returns(1);
      await battleCard.mock.balanceOf.withArgs(alice.address, 2).returns(1);

      // Mock withdrawal transfer
      await battleCard.mock.safeTransferFrom.withArgs(deck.address, alice.address, 1, 1, "0x").returns();

      // Add cards
      await deck.addBattleCardToDeck(1, 1);
      await deck.addBattleCardToDeck(1, 2);

      expect(await deck.getBattleCardInDeck(1)).to.eq(2);
    });

    it('Should allow removing a Battle Card from the deck', async () => {
      await battleCard.mock.safeTransferFrom.withArgs(deck.address, alice.address, 1, 1, "0x").returns();

      await deck.addBattleCardToDeck(1, 1);

      await deck.removeBattleCardFromDeck(1);

      await deck.getBattleCardInDeck(1).then((battleCardId: BigNumber) => {
          expect(battleCardId).to.eq(0);
      });
    });

    describe('Permissions', async () => {
      it('Should prevent adding cards you don\'t have', async () => {
          await battleCard.mock.balanceOf.withArgs(bob.address, 1).returns(0);
          await expect(bobSignedDeck.addBattleCardToDeck(1, 1)).to.be.revertedWith('revert Don\'t own battle card');
      });

      it('Should prevent removing a battle card from a deck which you don\'t own', async () => {
          await expect(bobSignedDeck.removeBattleCardFromDeck(1)).to.be.revertedWith('revert Not your deck');
      });
    });
  });

  describe('Support cards', async () => {
    beforeEach(async () => {
      await deck.createDeck();
      await supportCard.mock.safeTransferFrom.withArgs(alice.address, deck.address, 20, 2, "0x").returns();
      await supportCard.mock.safeTransferFrom.withArgs(alice.address, deck.address, 12, 1, "0x").returns();

      await supportCard.mock.balanceOf.withArgs(alice.address, 20).returns(8);
      await supportCard.mock.balanceOf.withArgs(alice.address, 12).returns(1);
    });

    it('Should allow support cards to be added to the deck', async () => {
      await deck.addSupportCardsToDeck(
        1,
        [
            {supportCardId: 20, amount: 2},
            {supportCardId: 12, amount: 1},
        ],
      );

      await deck.decks(1).then((deck: any) => {
        expect(deck['supportCardCount']).to.eq(3);
      });

      await deck.getCardTypesInDeck(1).then((cardTypes: BigNumber[]) => {
        expect(cardTypes.length).to.eq(2);
        expect(cardTypes[0]).to.eq(20);
        expect(cardTypes[1]).to.eq(12);
      });

      expect(await deck.getCountOfCardTypeInDeck(1, 20)).to.eq(2);
      expect(await deck.getCountOfCardTypeInDeck(1, 12)).to.eq(1);
    });

    it('Should allow support cards to be removed from the deck', async () => {
      await supportCard.mock.safeTransferFrom.withArgs(deck.address, alice.address, 20, 2, "0x").returns();

      await deck.addSupportCardsToDeck(
        1,
        [
            {supportCardId: 20, amount: 2},
            {supportCardId: 12, amount: 1},
        ],
      );

      await deck.removeSupportCardsFromDeck(1, [{
        supportCardId: 20,
        amount: 2,
      }]);

      await deck.decks(1).then((deck: any) => {
        expect(deck['supportCardCount']).to.eq(1);
      });

      expect(await deck.getCountOfCardTypeInDeck(1, 20)).to.eq(0);
    });

    it('Should prevent exceeding the support card limit', async () => {
      await supportCard.mock.safeTransferFrom.withArgs(alice.address, deck.address, 20, 20, "0x").returns();
      await supportCard.mock.safeTransferFrom.withArgs(alice.address, deck.address, 12, 60, "0x").returns();

      await supportCard.mock.balanceOf.withArgs(alice.address, 20).returns(20);
      await supportCard.mock.balanceOf.withArgs(alice.address, 12).returns(60);

      await expect(deck.addSupportCardsToDeck(
        1,
        [
            {
                supportCardId: 20,
                amount: 20,
            },
            {
                supportCardId: 12,
                amount: 55,
            },
        ],
      )).to.be.revertedWith("revert Deck is full");
    });

    it('Should allow getting all support cards from deck', async () => {
      await deck.addSupportCardsToDeck(
        1,
        [
            {supportCardId: 20, amount: 2},
            {supportCardId: 12, amount: 1},
        ],
      );
      await deck.getAllSupportCardsInDeck(1).then((supportCards: BigNumber[]) => {
        expect(supportCards.length).to.eq(3);
      });
    });
  });

  describe('Permissions', async () => {
    it('Should prevent anyone but the owner from setting the Battle Card address', async () => {
      await expect(bobSignedDeck.setBattleCardAddress(bob.address)).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('Should prevent anyone but the owner from setting the Support Card address', async () => {
      await expect(bobSignedDeck.setSupportCardAddress(bob.address)).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });
});
