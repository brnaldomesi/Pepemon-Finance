// SPDX-License-Identifier: MIT

pragma solidity 0.7.4;
pragma experimental ABIEncoderV2;

import "./Deck.sol";

contract Battle {
    //    address deckAddress;
    //
    //    constructor(address _deckAddress) public {
    //        deckAddress = _deckAddress;
    //    }
    //
    //    function fight(uint256 _attackingDeck, uint256 _defendingDeck) public {
    //        require(Deck(deckAddress).ownerOf(_attackingDeck) == msg.sender, "Must battle with your own deck");
    //        require(Deck(deckAddress).ownerOf(_defendingDeck) != msg.sender, "Cannot battle yourself");
    //
    //
    ////        uint256[] getActionCards();
    //    }
    //
    //    // function getActionCards(uint256 _deckId) public returns(uint256[] memory) {
    //    function getActionCards(uint256 _deckId) public {
    //        (uint256 ee, uint256 s) = Deck(deckAddress).decks(_deckId);
    //
    //        uint256 cardTypes = Deck(deckAddress).getCardTypesInDeck(_deckId);
    //        uint256[] memory totalCards = new uint256[](deck.cardCount);
    //
    //        for(uint256 i = 0; i < deck.cardCount; i++) {
    //            uint256[] memory cardCount = deck.actionCardTypes[i].cardList.length;
    //
    //            for(uint256 j = 0; j < cardCount; j++){
    //                totalCards.push(i);
    //            }
    //        }
    //    }
}
