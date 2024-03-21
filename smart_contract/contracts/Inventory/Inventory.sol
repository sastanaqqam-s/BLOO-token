// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "../Interface/IBLUEToken.sol";

// Struct to define the properties of each category
struct Category {
    string categoryName; // Name of the category
    uint lockedPeriod; // Duration for which tokens are locked
    uint vestingPeriod; // Duration of the vesting period
    uint percentageHold; // Percentage of tokens held initially
    uint totalTokens; // Total tokens in this category
    uint genesisPercentage; // Percentage of tokens released at genesis
    uint genesisAmount; // Amount of tokens released at genesis
    uint releasedToken; // Total tokens released so far
    uint avgReleasedToken; // Average tokens released per period
    uint remainReleasedToken; // Remaining tokens to be released
}

contract Inventory {
    IBLUEToken public feeToken; // Interface for the fee token contract

    uint public startAt = 0; // Start time for the distribution

    uint public totalUnlockedTokens = 0; // Total unlocked tokens across all categories

    uint public totalRemainingTokens = 0; // Total remaining tokens across all categories

    uint public totalCompletedMonths = 0; // Total completed months since start

    mapping(uint => uint) claimedMonth; // Mapping to track claimed months for each category

    Category[] public categories; // Array to store category details

    mapping(address => bool) public whiteListed; // Mapping to whitelist addresses

    address[] mpcAddress; // Array to store addresses of MPC nodes

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
        for (uint i = 0; i < data.length; i++) {
            categories.push(
                Category(
                    data[i].categoryName,
                    data[i].lockedPeriod,
                    data[i].vestingPeriod,
                    data[i].percentageHold,
                    data[i].totalTokens,
                    data[i].genesisPercentage,
                    data[i].genesisAmount,
                    data[i].releasedToken,
                    data[i].avgReleasedToken,
                    data[i].remainReleasedToken
                )
            );

            claimedMonth[i] = data[i].lockedPeriod; // Initialize claimed month for each category
        }
    }

    // Function to get details of all categories
    function getCategoryDetail() public view returns (Category[] memory) {
        return categories;
    }
}
