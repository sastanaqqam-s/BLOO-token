// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "./Inventory/Inventory.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Struct to store the address and token details of transfers made by the owner
struct TokenHolders {
    address users; // Address of the user
    uint256 tokens; // Number of tokens transferred
    uint time; // Timestamp of the transfer
}

// Vesting contract inheriting from Inventory and ReentrancyGuard
contract Vesting is Inventory, ReentrancyGuard {
    // Event to log token transfers
    event TokenTransfer(address from, address to, uint amount);

    // Constant defining the release interval in seconds
    uint256 private constant releaseInterval = 3600;

    // Array to store user addresses and token details transferred by admins
    TokenHolders[] public tokenHolders;

    // Constructor initializing the contract with fee token, MPC addresses, and category data
    constructor(
        IBLUEToken _feeToken,
        address[] memory mpcAddresses,
        Category[] memory data
    ) {
        feeToken = _feeToken;

        // Add MPC  addresses to the whitelist
        for (uint i = 0; i < mpcAddresses.length; i++) {
            mpcAddress.push(mpcAddresses[i]);
            whiteListed[mpcAddresses[i]] = true;
        }

        // Set category data
        setCategory(data);
    }

    // Function  to start the tokenization process,  only callable by whitelisted addresses
    function start() public onlyWhiteListed {
        require(startAt == 0, "Vesting: Tokenization already Started!");
        require(categories.length > 0, "Vesting: Category not Set!");

        // Set the start time of tokenization
        startAt = block.timestamp;

        // Release initial genesis amount of tokens
        _releasedGenesisAmt();
    }

    // Internal function to release initial genesis amount of tokens
    function _releasedGenesisAmt() private {
        for (uint i = 0; i < categories.length; ) {
            unchecked {
                totalUnlockedTokens += categories[i].genesisAmount;
                totalRemainingTokens += categories[i].genesisAmount;

                i++;
            }
        }
    }

    // Function to transfer tokens to multiple users, only callable by whitelisted addresses
    function multiTransferToken(
        address[] memory users,
        uint amount
    ) external onlyWhiteListed {
        require(amount > 0, "Vesting: Invalid tokenAmount");
        for (uint256 i = 0; i < users.length; ) {
            transferToken(users[i], amount);

            unchecked {
                i++;
            }
        }
    }

    // Function to transfer tokens to a single user, only callable by whitelisted addresses
    function transferToken(
        address userAddress,
        uint tokenAmount
    ) public onlyWhiteListed nonReentrant {
        calulateUnlockedToken();
        require(startAt > 0, "Vesting: Distribution not started yet!");
        require(tokenAmount > 0, "Vesting: Invalid tokenAmount");

        // Check if enough tokens are unlocked for transfer
        require(
            totalRemainingTokens >= tokenAmount,
            "Vesting: Not enough tokens have been unlocked at the moment!"
        );

        // Mint tokens to the user
        _mintTokens(msg.sender, userAddress, tokenAmount);
    }

    // Internal function to calculate unlocked tokens based on completed months
    function calulateUnlockedToken() private {
        uint completedMonth = (block.timestamp - startAt) / releaseInterval;

        if (completedMonth > totalCompletedMonths) {
            totalCompletedMonths = completedMonth;
            _checkVestedPeriod();
        }
    }

    // Internal function to check and release tokens according to vested periods
    function _checkVestedPeriod() private {
        for (uint i = 0; i < categories.length; ) {
            Category memory c1 = categories[i];
            uint cliffMonth = c1.lockedPeriod;
            uint vestedMonth = cliffMonth + c1.vestingPeriod;
            uint unlockingToken = 0;
            uint skipMonths = 0;

            // Check if completed month is within the vested period
            if (totalCompletedMonths > cliffMonth) {
                skipMonths = totalCompletedMonths - claimedMonth[i];

                if (totalCompletedMonths <= vestedMonth) {
                    if (totalCompletedMonths < vestedMonth) {
                        unlockingToken = c1.avgReleasedToken * skipMonths;
                    } else {
                        unlockingToken = c1.remainReleasedToken;
                    }
                }

                claimedMonth[i] = totalCompletedMonths;

                totalUnlockedTokens += unlockingToken;
                totalRemainingTokens += unlockingToken;
                c1.remainReleasedToken -= unlockingToken;

                categories[i] = c1;
            }

            unchecked {
                i++;
            }
        }
    }

    // Internal function to mint tokens to a user
    function _mintTokens(address from, address to, uint256 amount) private {
        totalRemainingTokens -= amount;

        feeToken.mint(to, amount);

        // Log token transfer
        tokenHolders.push(TokenHolders(to, amount, block.timestamp));
        emit TokenTransfer(from, to, amount);
    }

    // Function to get all users with their addresses and total token amounts
    function allusers() public view returns (TokenHolders[] memory) {
        return tokenHolders;
    }
}
