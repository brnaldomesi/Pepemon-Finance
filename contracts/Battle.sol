// SPDX-License-Identifier: MIT

pragma solidity 0.7.4;
pragma experimental ABIEncoderV2;

import "./Deck.sol";

contract Battle is Deck {
    address deckAddress;

    constructor(address _deckAddress) public {
        deckAddress = _deckAddress;
    }

    function fight(uint256 _attackingDeck, uint256 _defendingDeck) public {
        require(Deck(deckAddress).ownerOf(_attackingDeck) == msg.sender, "Must battle with your own deck");
        require(Deck(deckAddress).ownerOf(_defendingDeck) != msg.sender, "Cannot battle yourself");


//        uint256[] getActionCards();
    }

    /**
     * @dev Returns array of action cards for a deck
     * @param _deckId uint256 ID of the deck
     */
    function getActionCards(uint256 _deckId) public sendersDeck(_deckId) returns(uint256[] memory) {
        Decks storage deck = decks[_deckId];
        uint256[] memory actionCards = new uint256[](deck.actionCardCount);
        for (uint256 i = 0; i < deck.actionCardTypeList.length; i++) {
            uint256 actionCardTypeId = deck.actionCardTypeList[i];
            for (uint256 j = 0; j < deck.actionCardTypes[actionCardTypeId].count; j++) {
                actionCards[i + j] = actionCardTypeId;
            }
        }
        return actionCards;
    }

    // /**
    //  * @dev Draws cards in turn
    //  * @param _deckId uint256 ID of the deck
    //  */
    // function drawCardsInTurn(address player, ) public
}
