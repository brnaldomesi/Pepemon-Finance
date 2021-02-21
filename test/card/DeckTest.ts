import { deployDeckContract, getProvider } from '../helpers/contract';
import { CardBase, Deck, Pepemon } from '../../typechain';
import PepemonArtifact from '../../artifacts/contracts/Pepemon.sol/Pepemon.json';
import ActionCardArtifact from '../../artifacts/contracts/CardBase.sol/CardBase.json';

import { expect } from 'chai';
import { deployMockContract, MockContract } from 'ethereum-waffle';
import { BigNumber } from 'ethers';

const [alice, bob] = getProvider().getWallets();

describe('Deck', () => {
  let deck: Deck;
  let bobSignedDeck: Deck;
  let battleCard: Pepemon | MockContract;
  let actionCard: CardBase | MockContract;

  beforeEach(async () => {
    deck = await deployDeckContract(alice);
    bobSignedDeck = await deck.connect(bob);
    battleCard = await deployMockContract(alice, PepemonArtifact.abi);
    actionCard = await deployMockContract(alice, ActionCardArtifact.abi);

    await deck.setBattleCardAddress(battleCard.address);
    await deck.setActionCardAddress(actionCard.address);

    await battleCard.mock.ownerOf.withArgs(1).returns(alice.address);
  });

  describe('Deck', async () => {
    it('Should allow a deck to be created', async () => {
      await deck.createDeck();

      await deck.ownerOf(1).then(ownerAddress => {
        expect(ownerAddress).to.eq(alice.address);
      });
    });
  });

  describe('Battle card', async () => {
    beforeEach(async () => {
      await deck.createDeck();
      await battleCard.mock.transferFrom.withArgs(alice.address, deck.address, 1).returns();
    });

    it('Should allow adding a Battle Card to the deck', async () => {
      await battleCard.mock.transferFrom.withArgs(alice.address, deck.address, 22).returns();
      await battleCard.mock.ownerOf.withArgs(22).returns(alice.address);

      await deck.addBattleCard(1, 22);

      await deck.decks(1).then((deck: any) => {
        expect(deck['battleCardId']).to.eq(22);
      });
    });

    it('Should return the previous battle card if one has already been supplied', async () => {
      // Mock deposit transfer
      await battleCard.mock.transferFrom.withArgs(alice.address, deck.address, 1).returns();
      await battleCard.mock.transferFrom.withArgs(alice.address, deck.address, 2).returns();

      await battleCard.mock.ownerOf.withArgs(2).returns(alice.address);

      // Mock withdrawal transfer
      await battleCard.mock.transferFrom.withArgs(deck.address, alice.address, 1).returns();

      await deck.addBattleCard(1, 1);
      await deck.addBattleCard(1, 2);
    });

    it('Should allow adding a Battle Card to the deck', async () => {
      await battleCard.mock.transferFrom.withArgs(deck.address, alice.address, 1).returns();

      await deck.addBattleCard(1, 1);

      await deck.removeBattleCard(1);

      await deck.getBattleCardForDeck(1).then(battleCard => {
        expect(battleCard).to.eq(0);
      });

    });

    describe('Permissions', async () => {
      it('Should prevent adding cards which you don\'t own', async () => {
        await expect(bobSignedDeck.addBattleCard(1, 1)).to.be.revertedWith('revert Not your card');
      });

      it('Should prevent removing a battle card from a deck which you don\t own', async () => {
        await expect(bobSignedDeck.removeBattleCard(1)).to.be.revertedWith('revert Not your deck');
      });
    });
  });

  describe('Action cards', async () => {
    beforeEach(async () => {
      await deck.createDeck();
      await actionCard.mock.ownerOf.withArgs(1).returns(alice.address);
    });

    it('Should allow action cards to be added to the deck', async () => {
      await deck.addActionCards(
        1,
        [
          {
            'actionCardTypeId': 20,
            'actionCardId': 2,
          },
          {
            'actionCardTypeId': 12,
            'actionCardId': 55,
          },
        ],
      );

      await deck.decks(1).then((deck: any) => {
        expect(deck['cardCount']).to.eq(2);
      });

      await deck.getCardTypesInDeck(1).then((cardTypes: BigNumber[]) => {
        expect(cardTypes.length).to.eq(2);
        expect(cardTypes[0]).to.eq(20);
        expect(cardTypes[1]).to.eq(12);
      });

      await deck.getCardsFromTypeInDeck(1, 20).then((cardList: BigNumber[]) => {
        expect(cardList.length).to.eq(1);
        expect(cardList[0]).to.eq(2);
      });

      await deck.getCardsFromTypeInDeck(1, 12).then((cardList: BigNumber[]) => {
        expect(cardList.length).to.eq(1);
        expect(cardList[0]).to.eq(55);
      });
    });

    it('Should allow actions cards to be removed from the deck', async () => {
      await actionCard.mock.transferFrom.withArgs(deck.address, alice.address, 2).returns();

      await deck.addActionCards(
        1,
        [
          {
            'actionCardTypeId': 20,
            'actionCardId': 2,
          },
          {
            'actionCardTypeId': 12,
            'actionCardId': 55,
          },
        ],
      );

      await deck.removeActionCards(1, [{
        'actionCardTypeId': 20,
        'actionCardId': 2,
      }]);

      await deck.decks(1).then((deck: any) => {
        expect(deck['cardCount']).to.eq(1);
      });

      await deck.getCardTypesInDeck(1).then((cardTypeList: BigNumber[]) => {
        expect(cardTypeList.length).to.eq(1);
      });

      await deck.getCardsFromTypeInDeck(1, 20).then((cardList: BigNumber[]) => {
        expect(cardList.length).to.eq(0);
      });

    });

    it('Should prevent exceeding the action card limit', async () => {
      await deck.setMaxActionCards(1);

      await expect(deck.addActionCards(
        1,
        [
          {
            'actionCardTypeId': 20,
            'actionCardId': 2,
          },
          {
            'actionCardTypeId': 12,
            'actionCardId': 55,
          },
        ],
      )).to.be.revertedWith("revert Too many cards");


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
