// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

interface IBLUEToken {
    function mint(address walletAddress, uint256 amount) external;

    // function to transfer contract ownership to new address
    function transferOwnership(address newOwner) external;

    // function to transfer contract ownership to new address
    function setVestingcontract(address newVestingContract) external;
}
