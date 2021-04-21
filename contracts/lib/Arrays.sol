pragma solidity ^0.8.0;

library Arrays {
    function shuffle(uint256[] memory nums) internal view returns (uint256[] memory) {
        for (uint256 i = 0; i < nums.length; i++) {
            uint256 n = i + (uint256(keccak256(abi.encodePacked(block.timestamp))) % (nums.length - i));
            uint256 temp = nums[n];
            nums[n] = nums[i];
            nums[i] = temp;
        }
        return nums;
    }
}
