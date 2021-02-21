// SPDX-License-Identifier: MIT

pragma solidity 0.7.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Pepemon.sol";
import "./CardBase.sol";

contract Deck is ERC721, Ownable {
    struct Decks {
        // todo this will relate only to the ID of the card type, not the specific card.
        // Add battle card type to struct
        uint256 battleCardId;
        // mapping from Action Card Type to list of card IDs
        // I.E Quick Attack => [1, 50, 82]
        mapping(uint256 => ActionCardType) actionCardTypes;
        // Unordered array of Card Type Ids contained in the deck, mapped to ActionCardType struct via the pointer
        uint256[] actionCardTypeList;
    }

    struct ActionCardType {
        uint256 actionCardTypeId;
        uint256 pointer;
        bool isEntity;
        // Mapping from Action Card ID to the pointer. Will be used to accurately identify the specific card out of a list
        mapping(uint256 => ActionCard) cards;
        // Unordered array of Cards
        uint256[] cardList;
    }

    struct ActionCard {
        uint256 actionCardId;
        uint256 pointer;
        bool isEntity;
    }

    struct ActionCardRequest {
        uint256 actionCardTypeId;
        uint256 actionCardId;
    }

    uint8 public MAX_ACTION_CARDS;

    uint256 nextDeckId;
    address public battleCardAddress;
    address public actionCardAddress;

    mapping(uint256 => Decks) public decks;

    constructor() ERC721("Pepedeck", "Pepedeck") {
        nextDeckId = 1;
        MAX_ACTION_CARDS = 60;
    }

    function setBattleCardAddress(address _battleCardAddress) public onlyOwner {
        battleCardAddress = _battleCardAddress;
    }

    function setActionCardAddress(address _actionCardAddress) public onlyOwner {
        actionCardAddress = _actionCardAddress;
    }

    function createDeck() public {
        _safeMint(msg.sender, nextDeckId);
    }

    function addBattleCard(uint256 _deckId, uint256 _battleCardId) public {
        require(Pepemon(battleCardAddress).ownerOf(_battleCardId) == msg.sender, "Not your card");

        Pepemon(battleCardAddress).transferFrom(msg.sender, address(this), _battleCardId);

        if (decks[_deckId].battleCardId != 0) {
            Pepemon(battleCardAddress).transferFrom(address(this), msg.sender, decks[_deckId].battleCardId);
        }

        decks[_deckId].battleCardId = _battleCardId;
    }

    function removeBattleCard(uint256 _deckId) public {
        require(ownerOf(_deckId) == msg.sender, "Not your deck");

        Pepemon(battleCardAddress).transferFrom(address(this), msg.sender, decks[_deckId].battleCardId);

        decks[_deckId].battleCardId = 0;
    }

    function addActionCards(uint256 _deckId, ActionCardRequest[] memory _actionCards) public {
        // require(decks[_deckId].actionCards.length <= MAX_ACTION_CARDS, "Too many cards");

        for (uint256 i = 0; i < _actionCards.length; i++) {
            addActionCard(_deckId, _actionCards[i].actionCardTypeId, _actionCards[i].actionCardId);
        }
    }

    function addActionCard(
        uint256 _deckId,
        uint256 _actionCardTypeId,
        uint256 _actionCardId
    ) internal {
        addActionCardTypeToDeck(_deckId, _actionCardTypeId);

        decks[_deckId].actionCardTypes[_actionCardTypeId].cards[_actionCardId] = ActionCard({
            actionCardId : _actionCardId,
            pointer : 1,
            isEntity : true
            });

        decks[_deckId].actionCardTypes[_actionCardTypeId].cardList.push(_actionCardId);
    }

    function addActionCardTypeToDeck(uint256 _deckId, uint256 _actionCardTypeId) public {
        if (false == decks[_deckId].actionCardTypes[_actionCardTypeId].isEntity) {
            // Create the action card type
            ActionCardType storage actionCardList = decks[_deckId].actionCardTypes[_actionCardTypeId];
            actionCardList.actionCardTypeId = _actionCardTypeId;
            actionCardList.pointer = decks[_deckId].actionCardTypeList.length;
            actionCardList.isEntity = true;

            // Append the ID to the list
            decks[_deckId].actionCardTypeList.push(_actionCardTypeId);
        }
    }

    function removeActionCardTypeFromDeck(uint256 _deckId, uint256 _actionCardTypeId) internal {
        Decks storage deck = decks[_deckId];
        ActionCardType storage actionCardType = decks[_deckId].actionCardTypes[_actionCardTypeId];

        uint256 cardTypeToRemove = actionCardType.pointer;

        if (deck.actionCardTypeList.length > 1 && cardTypeToRemove != deck.actionCardTypeList.length - 1) {
            // last card type in list
            uint256 rowToMove = deck.actionCardTypeList[deck.actionCardTypeList.length - 1];

            // swap delete row with row to move
            decks[_deckId].actionCardTypes[rowToMove].pointer = cardTypeToRemove;
        }

        decks[_deckId].actionCardTypeList.pop();
        delete decks[_deckId].actionCardTypes[cardTypeToRemove];
    }

    function removeActionCards(uint256 _deckId, ActionCardRequest[] memory _actionCards) public {
        for (uint256 i = 0; i < _actionCards.length; i++) {
            removeActionCard(_deckId, _actionCards[i].actionCardTypeId, _actionCards[i].actionCardId);
        }
    }

    function removeActionCard(
        uint256 _deckId,
        uint256 _actionCardTypeId,
        uint256 _actionCardId
    ) internal {
        ActionCardType storage actionCardType = decks[_deckId].actionCardTypes[_actionCardTypeId];
        ActionCard storage actionCard = decks[_deckId].actionCardTypes[_actionCardTypeId].cards[_actionCardId];

        uint256 cardToRemove = actionCard.pointer;

        // If there is more than 1 card in the list & it is not the last one we will swap the last card to the position
        // of the one we're removing (this allows us avoid reshuffling)
        if (actionCardType.cardList.length > 1 && cardToRemove != actionCardType.cardList.length - 1) {
            // last card in list
            uint256 rowToMove = actionCardType.cardList[actionCardType.cardList.length - 1];

            // swap delete row with row to move
            decks[_deckId].actionCardTypes[_actionCardTypeId].cards[rowToMove].pointer = cardToRemove;
        }

        decks[_deckId].actionCardTypes[_actionCardTypeId].cardList.pop();
        delete decks[_deckId].actionCardTypes[_actionCardTypeId].cards[cardToRemove];

        if (actionCardType.cardList.length == 0) {
            removeActionCardTypeFromDeck(_deckId, _actionCardTypeId);
        }

        CardBase(actionCardAddress).transferFrom(address(this), msg.sender, _actionCardId);
    }

    function getBattleCardForDeck(uint256 _deckId) public view returns (uint256) {
        return decks[_deckId].battleCardId;
    }

    function getCardTypesInDeck(uint256 _deckId) public view returns (uint256[] memory) {
        Decks storage deck = decks[_deckId];

        uint256[] memory actionCardTypes = new uint256[](deck.actionCardTypeList.length);

        for (uint256 i = 0; i < deck.actionCardTypeList.length; i++) {
            actionCardTypes[i] = deck.actionCardTypeList[i];
        }

        return actionCardTypes;
    }

    function getCardsFromTypeInDeck(uint256 _deckId, uint256 _cardTypeId) public view returns (uint256[] memory) {
        Decks storage deck = decks[_deckId];
        ActionCardType storage actionCardType = deck.actionCardTypes[_cardTypeId];

        uint256[] memory actionCardList = new uint256[](actionCardType.cardList.length);

        for (uint256 i = 0; i < actionCardType.cardList.length; i++) {
            actionCardList[i] = actionCardType.cardList[i];
        }

        return actionCardList;
    }

    modifier sendersDeck(uint256 _deckId) {
        require(msg.sender == ownerOf(_deckId));
        _;
    }
}
