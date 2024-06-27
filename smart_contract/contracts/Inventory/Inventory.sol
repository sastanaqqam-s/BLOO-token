// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "../Interface/IBLUEToken.sol";

// Struct to define the properties of each category
struct Category {
    string categoryName; // Name of the category
    uint lockedPeriod; // Duration for which tokens are locked
    uint vestingPeriod; // Duration of the vesting period
    uint totalTokens; // Total tokens in this category
    uint genesisAmount; // Amount of tokens released at genesis
    uint releasedToken; // This is used to gather information to determine the total amount of tokens that will be released after the locked period ends (according to the vesting schedule).
    uint avgReleasedToken; // Average tokens released per period
    uint totalRemainingTokens; // Total tokens remaining to be vested
    address beneficiary; // Beneficiary address
}

// Struct to store the address and token details of transfers made by the owner
struct TokenHolders {
    uint categoryId; // ID of the category
    address users; // Address of the user
    uint256 tokens; // Number of tokens transferred
    uint time; // Timestamp of the transfer
}

contract Inventory {
    // Event to log updates to beneficiary addresses
    event UpdateBeneficiary(
        uint categoryId,
        address newBeneficiary,
        address caller,
        uint timestamp
    );

    // Event to log token transfers
    event TokenTransfer(address from, address to, uint amount);

    // Event emitted when the contract ownership is transferred to a new owner
    event TransferOwnership(
        address indexed _oldOwner,
        address indexed _newOwner
    );

    event UpdateWhiteListedAddress(
        address whiteListedAddress,
        bool status,
        address setBy
    );

    IBLUEToken public feeToken; // Interface for the fee token contract

    // Store the address of the contract owner; used only for setting the vesting contract address
    address public owner = msg.sender;

    uint public startAt; // Start time for the distribution

    mapping(uint => uint) totalCompletedMonths; // Total completed months since start for each category

    mapping(uint => uint) public claimedMonth; // Mapping to track claimed months for each category

    mapping(address => bool) public whiteListed; // Mapping to whitelist addresses

    address[] mpcAddress; // Array to store addresses of MPC nodes

    Category[] public categories; // Array to store category details

    // Array to store user addresses and token details transferred by admins
    TokenHolders[] public tokenHolders;

    // Modifier to restrict functions to the contract owner
    modifier onlyOwner() {
        require(
            owner == msg.sender,
            "Vesting: Only Owner can perform this action!"
        );
        _;
    }

    // Modifier to restrict access to only whitelisted addresses
    modifier onlyWhiteListed() {
        require(
            whiteListed[msg.sender],
            "Vesting: Only Whitelisted Address can perform this action!"
        );
        _;
    }

    // Internal function to set category details
    function setCategory(Category[] memory data) internal {
        uint totalSupply;
        for (uint i = 0; i < data.length; ) {
            // Validate beneficiary address
            if (data[i].beneficiary == address(0)) {
                revert("Vesting: Invalid beneficiary address!");
            }

            // Calculate total supply to ensure it does not exceed max supply
            totalSupply += data[i].genesisAmount + data[i].releasedToken;

            // Add category details to categories array
            categories.push(
                Category(
                    data[i].categoryName,
                    data[i].lockedPeriod,
                    data[i].vestingPeriod,
                    data[i].totalTokens,
                    data[i].genesisAmount,
                    data[i].releasedToken,
                    data[i].avgReleasedToken,
                    data[i].totalRemainingTokens,
                    data[i].beneficiary
                )
            );

            // Initialize claimed month for each category to its locked period
            unchecked {
                claimedMonth[i] = data[i].lockedPeriod;
                i++;
            }
        }

        // Ensure total supply does not exceed the fee token's max supply
        if (totalSupply != feeToken.maxSupply()) {
            revert("Vesting: Total tokens exceeds max supply!");
        }
    }

    // Function to get details of all categories
    function getCategoryDetail() external view returns (Category[] memory) {
        return categories;
    }

    // Function to get details of all whitelisted addresses
    function getAllWhiteListed() external view returns (address[] memory) {
        return mpcAddress;
    }

    // Function to update the beneficiary of a specific category
    function updateBeneficiary(
        uint categoryId,
        address newBeneficiary
    ) external onlyWhiteListed {
        // Validate the new beneficiary address
        if (newBeneficiary == address(0)) {
            revert("Vesting: Invalid beneficiary address!");
        }

        // Update the beneficiary for the specified category
        categories[categoryId].beneficiary = newBeneficiary;

        // Emit an event to log the update
        emit UpdateBeneficiary(
            categoryId,
            newBeneficiary,
            msg.sender,
            block.timestamp
        );
    }

    // Function to update the beneficiary of a specific category
    function updateWhiteListedAddress(
        address whiteListedAddress,
        bool status
    ) external onlyOwner {
        // Validate the new beneficiary address
        if (whiteListedAddress == address(0)) {
            revert("Vesting: Invalid White Listed address!");
        }

        whiteListed[whiteListedAddress] = status;

        // Emit an event to log the update
        emit UpdateWhiteListedAddress(whiteListedAddress, status, msg.sender);
    }

    // Function to transfer contract ownership to a new address, restricted to the current owner
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Vesting: Invalid address!");
        emit TransferOwnership(owner, newOwner);
        owner = newOwner;
    }
}
