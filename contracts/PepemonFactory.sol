// SPDX-License-Identifier: MIT

pragma solidity 0.7.4;

interface PepemonFactory {
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _id,
        uint256 _amount,
        bytes calldata _data
    ) external;

    function balanceOf(address _owner, uint256 _id) external view returns (uint256);
}
