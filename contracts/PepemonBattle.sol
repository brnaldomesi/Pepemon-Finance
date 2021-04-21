// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PepemonCardDeck.sol";
import "./PepemonCard.sol";

contract PepemonBattle is Ownable {
    using SafeMath for uint256;

    enum Role {ATTACK, DEFENSE}

    struct Battle {
        uint256 battleId;
        address p1;
        uint256 p1DeckId;
        address p2;
        uint256 p2DeckId;
        address winner;
        bool ended;
        uint256 createdAt;
    }

    struct PlayerHand {
        address player;
        uint256 battleCardId;
        uint256[] supportCardIdList;
        Role role;
    }

    struct Turn {
        PlayerHand p1Hand;
        PlayerHand p2Hand;
    }

    mapping(uint256 => Battle) public battles;
    Turn[] turns;

    uint256 nextBattleId;
    uint8 refreshTurn = 5;
    uint256[] p1SupportCardList;
    uint256[] p2SupportCardList;
    uint256 p1PlayedCardCount;
    uint256 p2PlayedCardCount;

    address cardAddress;
    address deckAddress;

    PepemonCard cardContract;
    PepemonCardDeck deckContract;

    constructor(address _cardAddress, address _deckAddress) public {
        cardAddress = _cardAddress;
        deckAddress = _deckAddress;
        cardContract = PepemonCard(cardAddress);
        deckContract = PepemonCardDeck(deckAddress);
        nextBattleId = 1;
    }

    /**
     * @dev Set card address
     * @param _cardAddress address
     */
    function setCardAddress(address _cardAddress) public {
        cardAddress = _cardAddress;
        cardContract = PepemonCard(cardAddress);
    }

    /**
     * @dev Set deck address
     * @param _deckAddress address
     */
    function setDeckAddress(address _deckAddress) public {
        deckAddress = _deckAddress;
        deckContract = PepemonCardDeck(deckAddress);
    }

    /**
     * @dev Create battle
     * @param _p1 address player1
     * @param _p2 address player2
     */
    function createBattle(address _p1, address _p2) public {
        require(_p1 != _p2, "No Battle yourself");
        battles[nextBattleId] = Battle(
            nextBattleId,
            _p1,
            deckContract.playerToDecks(_p1),
            _p2,
            deckContract.playerToDecks(_p2),
            address(0),
            false,
            block.timestamp
        );
        nextBattleId = nextBattleId.add(1);
    }

    /**
     * @dev Start battle
     * @param _battleId uint256 battle id
     */
    function startBattle(uint256 _battleId) public {
        Battle memory battle = battles[_battleId];
        p1SupportCardList = deckContract.getAllSupportCardsInDeck(battle.p1DeckId);
        p2SupportCardList = deckContract.getAllSupportCardsInDeck(battle.p2DeckId);
        p1PlayedCardCount = 0;
        p2PlayedCardCount = 0;
    }

    /**
     * @dev Get cards in turn
     * @param _battleId uint256
     */
    function _getSupportCardsInTurn(uint256 _battleId) private {
        Battle memory battle = battles[_battleId];

        (uint256 p1BattleCardId, ) = deckContract.decks(battle.p1DeckId);
        (, , , , uint256 p1INT, , , , ) = cardContract.battleCardStats(p1BattleCardId);
        uint256[] memory p1SupportCards = new uint256[](p1INT);
        for (uint256 i = 0; i < p1INT; i++) {
            p1SupportCards[i] = p1SupportCardList[p1PlayedCardCount + i];
        }
        p1PlayedCardCount = p1PlayedCardCount.add(p1INT);

        (uint256 p2BattleCardId, ) = deckContract.decks(battle.p2DeckId);
        (, , , , uint256 p2INT, , , , ) = cardContract.battleCardStats(p2BattleCardId);
        uint256[] memory p2SupportCards = new uint256[](p2INT);
        for (uint256 i = 0; i < p2INT; i++) {
            p2SupportCards[i] = p2SupportCardList[p2PlayedCardCount + i];
        }
        p2PlayedCardCount = p2PlayedCardCount.add(p2INT);

        turns.push(
            Turn(
                PlayerHand(battle.p1, p1BattleCardId, p1SupportCards, Role.ATTACK),
                PlayerHand(battle.p2, p2BattleCardId, p2SupportCards, Role.DEFENSE)
            )
        );
    }

    // function fight(uint256 _attackingDeck, uint256 _defendingDeck) public {
    //     require(Deck(deckAddress).ownerOf(_attackingDeck) == msg.sender, "Must battle with your own deck");
    //     require(Deck(deckAddress).ownerOf(_defendingDeck) != msg.sender, "Cannot battle yourself");

    //     //        uint256[] getActionCards();
    // }
}
