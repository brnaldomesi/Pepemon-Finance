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
}
