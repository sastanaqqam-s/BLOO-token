// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Interface/IBLUEToken.sol";

contract BLUEToken is IBLUEToken, ERC20 {
    bool public initialized;

    // store owner address No need to implement Two-step Ownership Transfer Process, This Owner only used to set vesting contract address
    address public owner = msg.sender;

    // get log of old and new contract owner
    event TransferOwnership(address _oldOwner, address _newOwner);

    // set max supply value in constructor
    uint256 public immutable max_supply;

    address public vestingContract;

    modifier onlyOwner() {
        require(
            owner == msg.sender,
            "BLUE: Only Owner can perform this action!"
        );
        _;
    }

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 max_supply_
    ) ERC20(name_, symbol_) {
        max_supply = max_supply_;
    }

    function mint(address walletAddress, uint256 amount) external {
        require(
            vestingContract == msg.sender,
            "BLUE: Only Vesting Contract can do this action!"
        );
        // not minting  token more than max supply

        require(totalSupply() + amount <= max_supply, "BLUE: SUPPLY_OVERFLOW!");
        _mint(walletAddress, amount);
    }

    // function to transfer contract ownership to new address
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "BLUE: Invalid address!");
        owner = newOwner;
        emit TransferOwnership(msg.sender, newOwner);
    }

    // function to transfer contract ownership to new address
    function setVestingcontract(address newVestingContract) external onlyOwner {
        if (newVestingContract == address(0)) {
            revert("BLUE: Invalid Address!");
        }

        require(!initialized, "BLUE: Vesting Contract Already Initialized!");

        vestingContract = newVestingContract;

        initialized = true;

        emit SetVestingcontract(msg.sender, vestingContract);
    }
}
