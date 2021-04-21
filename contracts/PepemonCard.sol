// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PepemonCard is Ownable {
    struct BattleCardStats {
        uint256 battleCardId;
        uint256 battleType;
        uint256 hp;
        uint256 spd;
        uint256 inte;
        uint256 def;
        uint256 atk;
        uint256 sAtk;
        uint256 sDef;
    }

    struct SupportCardStats {
        uint256 supportCardId;
        uint256 supportType;
        uint256 modifierTypeCurrentTurn;
        uint256 modifierValueCurrentTurn;
        uint256 modifierTypeNextTurns;
        uint256 modifierValueNextTurns;
        uint256 modifierNumberOfNextTurns;
        uint256 requirementCode;
    }

    mapping(uint256 => BattleCardStats) public battleCardStats;
    mapping(uint256 => SupportCardStats) public supportCardStats;

    event BattleCardCreated(address sender, uint256 cardId);
    event BattleCardUpdated(address sender, uint256 cardId);
    event SupportCardCreated(address sender, uint256 cardId);
    event SupportCardUpdated(address sender, uint256 cardId);

    constructor() public {}

    function addBattleCard(BattleCardStats memory cardData) public onlyOwner {
        require(battleCardStats[cardData.battleCardId].battleCardId == 0, "BattleCard already exists");

        BattleCardStats storage _card = battleCardStats[cardData.battleCardId];
        _card.battleCardId = cardData.battleCardId;
        _card.hp = cardData.hp;
        _card.spd = cardData.spd;
        _card.inte = cardData.inte;
        _card.def = cardData.def;
        _card.atk = cardData.atk;
        _card.sDef = cardData.sDef;
        _card.sAtk = cardData.sAtk;

        emit BattleCardCreated(msg.sender, cardData.battleCardId);
    }

    function updateBattleCard(BattleCardStats memory cardData) public onlyOwner {
        require(battleCardStats[cardData.battleCardId].battleCardId != 0, "BattleCard not found");

        BattleCardStats storage _card = battleCardStats[cardData.battleCardId];
        _card.hp = cardData.hp;
        _card.battleType = cardData.battleType;
        _card.spd = cardData.spd;
        _card.inte = cardData.inte;
        _card.def = cardData.def;
        _card.atk = cardData.atk;
        _card.sDef = cardData.sDef;
        _card.sAtk = cardData.sAtk;

        emit BattleCardUpdated(msg.sender, cardData.battleCardId);
    }

    function getBattleCard(uint256 _id) public view returns (BattleCardStats memory) {
        require(battleCardStats[_id].battleCardId != 0, "BattleCard not found");
        return battleCardStats[_id];
    }

    function addSupportCard(SupportCardStats memory cardData) public onlyOwner {
        require(supportCardStats[cardData.supportCardId].supportCardId == 0, "SupportCard already exists");

        SupportCardStats storage _card = supportCardStats[cardData.supportCardId];
        _card.supportCardId = cardData.supportCardId;
        _card.supportType = cardData.supportType;
        _card.modifierTypeCurrentTurn = cardData.modifierTypeCurrentTurn;
        _card.modifierValueCurrentTurn = cardData.modifierValueCurrentTurn;
        _card.modifierTypeNextTurns = cardData.modifierTypeNextTurns;
        _card.modifierValueNextTurns = cardData.modifierValueNextTurns;
        _card.modifierNumberOfNextTurns = cardData.modifierNumberOfNextTurns;
        _card.requirementCode = cardData.requirementCode;

        emit SupportCardCreated(msg.sender, cardData.supportCardId);
    }

    function updateSupportCard(SupportCardStats memory cardData) public onlyOwner {
        require(supportCardStats[cardData.supportCardId].supportCardId != 0, "SupportCard not found");

        SupportCardStats storage _card = supportCardStats[cardData.supportCardId];
        _card.supportType = cardData.supportType;
        _card.modifierTypeCurrentTurn = cardData.modifierTypeCurrentTurn;
        _card.modifierValueCurrentTurn = cardData.modifierValueCurrentTurn;
        _card.modifierTypeNextTurns = cardData.modifierTypeNextTurns;
        _card.modifierValueNextTurns = cardData.modifierValueNextTurns;
        _card.modifierNumberOfNextTurns = cardData.modifierNumberOfNextTurns;
        _card.requirementCode = cardData.requirementCode;

        emit SupportCardCreated(msg.sender, cardData.supportCardId);
    }

    function getSupportCard(uint256 _id) public view returns (SupportCardStats memory) {
        require(supportCardStats[_id].supportCardId != 0, "SupportCard not found");
        return supportCardStats[_id];
    }
}
