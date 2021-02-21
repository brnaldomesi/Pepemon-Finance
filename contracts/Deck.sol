pragma solidity 0.7.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Pepemon.sol";

contract Deck is ERC721, Ownable {

    struct Decks {
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

        // Mapping from Action Card ID to the
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

    function addActionCards(uint256 _deckId, ActionCardRequest[] memory _actionCards) public {
        // require(decks[_deckId].actionCards.length <= MAX_ACTION_CARDS, "Too many cards");

        for (uint256 i = 0; i < _actionCards.length; i++) {
            addActionCard(
                _deckId,
                _actionCards[i].actionCardTypeId,
                _actionCards[i].actionCardId
            );
        }
    }

    function addActionCard(uint256 _deckId, uint256 _actionCardTypeId, uint256 _actionCardId) internal {
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


    //    function remove(address _itemAddress) public {
    //        require(isEntity(_itemAddress), "Item not found");
    //
    //        uint256 rowToDelete = itemStructs[_itemAddress].listPointer;
    //
    //        // If length is  1 or the row to delete is the final row we will just remove the record
    //        if (itemList.length > 1 && rowToDelete != itemList.length - 1) {
    //            // last row in list
    //            address rowToMove = itemList[itemList.length - 1];
    //
    //            // swap delete row with row ot move
    //            itemStructs[rowToMove].listPointer = rowToDelete;
    //        }
    //
    //        itemList.pop();
    //        delete itemStructs[_itemAddress];
    //
    //        emit ItemRemoved(_itemAddress, block.timestamp);
    //    }


    function getCardTypesInDeck(uint256 _deckId) view public returns (uint256[] memory)  {
        Decks storage deck = decks[_deckId];

        uint256[] memory actionCardTypes = new uint256[](deck.actionCardTypeList.length);

        for (uint256 i = 0; i < deck.actionCardTypeList.length; i++) {
            actionCardTypes[i] = deck.actionCardTypeList[i];
        }

        return actionCardTypes;
    }

    function getCardsFromTypeInDeck(uint256 _deckId, uint256 _cardTypeId) view public returns (uint256[] memory)  {
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
