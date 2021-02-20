pragma solidity 0.7.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Pepemon.sol";

contract Deck is ERC721, Ownable {

    struct DeckBuilds {
        uint256 battleCardId;
        uint256[] actionCards;
    }

    uint256 nextDeckId;
    address battleCardAddress;
    address actionCardAddress;

    mapping(uint256 => DeckBuilds) public decks;

    constructor() ERC721("Pepedeck", "Pepedeck") {
        nextDeckId = 1;
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
        Pepemon(battleCardAddress).transferFrom(msg.sender, address(this), _battleCardId);

        if (decks[_deckId].battleCardId != 0) {
            Pepemon(battleCardAddress).transferFrom(address(this), msg.sender, decks[_deckId].battleCardId);
        }

        decks[_deckId].battleCardId = _battleCardId;
    }

    modifier sendersDeck(uint256 _deckId) {
        require(msg.sender == ownerOf(_deckId));
        _;
    }


}
