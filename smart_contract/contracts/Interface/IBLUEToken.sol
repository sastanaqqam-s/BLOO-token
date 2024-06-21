// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

interface IBLUEToken {
    // Event emitted when the contract ownership is transferred to a new owner
    event TransferOwnership(
        address indexed _oldOwner,
        address indexed _newOwner
    );

    // Event emitted when the vesting contract address is set
    event SetVestingcontract(
        address indexed _owner,
        address indexed _vestingContract
    );

    function maxSupply() external view returns (uint256);

    function mint(address walletAddress, uint256 amount) external;

    // function to transfer contract ownership to new address
    function transferOwnership(address newOwner) external;

    // function to transfer contract ownership to new address
    function setVestingcontract(address newVestingContract) external;
}
