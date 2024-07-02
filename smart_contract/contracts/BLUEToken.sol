// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Interface/IBLUEToken.sol";

contract BLUEToken is IBLUEToken, ERC20 {
    // Flag to indicate whether the vesting contract address has been set
    bool public initialized;

    // Store the address of the contract owner; used only for setting the vesting contract address
    address public owner = msg.sender;

    // Maximum supply of the token, set during contract deployment
    uint256 public immutable maxSupply = 5_000_000_000 ether;

    // Address of the vesting contract allowed to mint tokens
    address public vestingContract;

    // Modifier to restrict functions to the contract owner
    modifier onlyOwner() {
        require(
            owner == msg.sender,
            "BLUE: Only Owner can perform this action!"
        );
        _;
    }

    // Constructor to initialize the token with a name, symbol, and maximum supply
    constructor(
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) {}

    // Function to mint new tokens, restricted to the vesting contract
    function mint(address walletAddress, uint256 amount) external {
        require(
            vestingContract == msg.sender,
            "BLUE: Only Vesting Contract can do this action!"
        );
        // Ensure that the total supply does not exceed the maximum supply
        require(totalSupply() + amount <= maxSupply, "BLUE: SUPPLY_OVERFLOW!");
        _mint(walletAddress, amount);
    }

    // Function to burn tokens from the caller's balance
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    // Function to transfer contract ownership to a new address, restricted to the current owner
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "BLUE: Invalid address!");
        emit TransferOwnership(owner, newOwner);
        owner = newOwner;
    }

    // Function to set the vesting contract address, restricted to the current owner
    function setVestingcontract(address newVestingContract) external onlyOwner {
        require(newVestingContract != address(0), "BLUE: Invalid Address!");

        // Ensure that the vesting contract address is set only once
        require(!initialized, "BLUE: Vesting Contract Already Initialized!");

        vestingContract = newVestingContract;

        initialized = true;

        emit SetVestingcontract(owner, vestingContract);
    }
}
