// SPDX-License-Identifier: MIT

pragma solidity 0.7.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CardBase is ERC721, Ownable {
    event CardCreated(string name, CardStats cardStats, uint256 when);
    event CardMinted(address who, uint256 id, uint256 when);

    enum Type {OFFENCE, DEFENCE, SPECIAL_OFFENCE, SPECIAL_DEFENCE}

    struct AttackStats {
        uint8 effect;
        uint8 additionalMultiplier;
        uint8 additionalValue;
        uint8 requirementCode;
        uint8 nextTurns;
    }

    struct DefenceStats {
        uint8 effect;
        uint8 additionalMultiplier;
        uint8 additionalValue;
        uint8 requirementCode;
        uint8 nextTurns;
    }

    struct CardStats {
        Type _type;
        AttackStats _attackStats;
        DefenceStats _defenceStats;
    }

    uint256 nextCardId;
    CardStats cardStats;

    constructor(
        string memory _name,
        string memory _symbol,
        CardStats memory _cardStats
    ) public ERC721(_name, _symbol) {
        emit CardCreated(_name, _cardStats, block.timestamp);

        cardStats = _cardStats;
        nextCardId = 0;
    }

    function mint(address _who) public {
        emit CardMinted(_who, nextCardId, block.timestamp);

        _safeMint(_who, nextCardId);
        nextCardId++;
    }
}
