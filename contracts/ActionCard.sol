// SPDX-License-Identifier: MIT

pragma solidity 0.7.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract ActionCard is ERC721, Ownable {
    using SafeMath for uint256;

    event ActionCardCreated(string name, ActionCardStats actionCardStats, uint256 when);
    event ActionCardMinted(address who, uint256 id, uint256 when);

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

    struct ActionCardStats {
        Type _type;
        AttackStats _attackStats;
        DefenceStats _defenceStats;
    }

    uint256 nextCardId;
    // ActionCardStats actionCardStats;
    mapping(uint256 => ActionCardStats) public idToActionCardStats;

    constructor(
        string memory _name,
        string memory _symbol,
        ActionCardStats memory _actionCardStats
    ) public ERC721(_name, _symbol) {
        emit ActionCardCreated(_name, _actionCardStats, block.timestamp);

        // actionCardStats = _actionCardStats;
        idToActionCardStats[nextCardId] = _actionCardStats;
        nextCardId.add(1);
    }

    function mint(address _who) public {
        emit ActionCardMinted(_who, nextCardId, block.timestamp);

        _safeMint(_who, nextCardId);
        nextCardId.add(1);
    }

    function getActionCard(uint256 _id) public returns (ActionCardStats memory) {
        return idToActionCardStats[_id];
    }
}
