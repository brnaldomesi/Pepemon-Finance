pragma solidity 0.7.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Pepemon is ERC721, Ownable {
    uint256 nextItemId;

    constructor(string memory name, string memory symbol) public ERC721(name, symbol) {
        nextItemId = 0;
    }

    function mint(address _who) public {}
}
