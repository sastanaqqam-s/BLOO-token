// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

// Uncomment this line to use console.log
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
    uint releasedToken; // This is used to gather information to determine the total amount of tokens that will be released after the locked period ends (according to the vesting schedule).
    uint avgReleasedToken; // Average tokens released per period
    uint remainReleasedToken; // Remaining tokens to be released
}

contract Inventory {
    IBLUEToken public feeToken; // Interface for the fee token contract

    uint public startAt; // Start time for the distribution

    uint public totalUnlockedTokens; // Total unlocked tokens across all categories

    uint public totalRemainingTokens; // Total remaining tokens across all categories

    uint public totalCompletedMonths; // Total completed months since start

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
        uint totalSupply;
        for (uint i = 0; i < data.length; i++) {
            totalSupply += data[i].genesisAmount + data[i].releasedToken;

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

        if (totalSupply != feeToken.max_supply()) {
            revert("Vesting: Total tokens exceeds max supply!");
        }
    }

    // Function to get details of all categories
    function getCategoryDetail() external view returns (Category[] memory) {
        return categories;
    }
}
