// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

interface IBLUEToken {
    event SetVestingcontract(address setBy, address vestingContract);

    function max_supply() external view returns (uint256);

    function mint(address walletAddress, uint256 amount) external;

    // function to transfer contract ownership to new address
    function transferOwnership(address newOwner) external;

    // function to transfer contract ownership to new address
    function setVestingcontract(address newVestingContract) external;
}
