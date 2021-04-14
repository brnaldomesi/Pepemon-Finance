pragma solidity 0.7.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract BattleCard is ERC721, Ownable {
    using SafeMath for uint256;

    event BattleCardCreated(string name, BattleCardStats battleCardStats, uint256 when);
    event BattleCardMinted(address who, uint256 id, uint256 when);

    struct BattleCardStats {
        // uint256 battleCardId;
        uint256 battleType;
        uint256 hp;
        uint256 speed;
        uint256 intelligence;
        uint256 defense;
        uint256 attack;
        uint256 specialAttack;
        uint256 specialDefense;
    }

    uint256 nextBattleCardId;
    // BattleCardStats battleCardStats;
    mapping(uint256 => BattleCardStats) public idToBattleCardStats;

    constructor(
        string memory _name,
        string memory _symbol,
        BattleCardStats memory _battleCardStats
    ) public ERC721(_name, _symbol) {
        emit BattleCardCreated(_name, _battleCardStats, block.timestamp);

        // battleCardStats = _battleCardStats;
        idToBattleCardStats[nextBattleCardId] = _battleCardStats;
        // nextBattleCardId = 0;
        nextBattleCardId.add(1);
    }

    function mint(address _who) public {
        emit BattleCardMinted(_who, nextBattleCardId, block.timestamp);

        _safeMint(_who, nextBattleCardId);
        nextBattleCardId.add(1);
    }

    function getBattleCard(uint256 _id) public returns (BattleCardStats memory) {
        return idToBattleCardStats[_id];
    }
}
