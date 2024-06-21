// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "./Inventory/Inventory.sol";

// Struct to store the address and token details of transfers made by the owner
struct TokenHolders {
    address users; // Address of the user
    uint256 tokens; // Number of tokens transferred
    uint time; // Timestamp of the transfer
}

// Vesting contract inheriting from Inventory
contract Vesting is Inventory {
    // Event to log token transfers
    event TokenTransfer(address from, address to, uint amount);

    uint256 private constant releaseInterval = 30 days;

    // Array to store user addresses and token details transferred by admins
    TokenHolders[] public tokenHolders;

    // Constructor initializing the contract with fee token, MPC addresses, and category data
    constructor(
        IBLUEToken _feeToken,
        address[] memory mpcAddresses,
        Category[] memory data
    ) {
        if (address(_feeToken) == address(0)) {
            revert("Vesting: Invalid FeeToken Address!");
        }

        feeToken = _feeToken;

        // Add MPC  addresses to the whitelist
        for (uint i = 0; i < mpcAddresses.length; i++) {
            if (mpcAddresses[i] == address(0)) {
                revert("Vesting: Invalid MPC Address!");
            }

            mpcAddress.push(mpcAddresses[i]);
            whiteListed[mpcAddresses[i]] = true;
        }

        // Set category data
        setCategory(data);
    }

    // Function  to start the tokenization process,  only callable by whitelisted addresses
    function start() external onlyWhiteListed {
        require(startAt == 0, "Vesting: Tokenization already Started!");

        // Set the start time of tokenization
        startAt = block.timestamp;

        // Release initial genesis amount of tokens
        _releasedGenesisAmt();
    }

    // Internal function to release initial genesis amount of tokens
    function _releasedGenesisAmt() private {
        uint localTotalUnlockedTokens;
        uint localTotalRemainingTokens;

        for (uint i = 0; i < categories.length; ) {
            unchecked {
                localTotalUnlockedTokens += categories[i].genesisAmount;
                localTotalRemainingTokens += categories[i].genesisAmount;

                categories[i].remainReleasedToken -= categories[i]
                    .genesisAmount;
                i++;
            }
        }

        totalUnlockedTokens += localTotalUnlockedTokens;
        totalRemainingTokens += localTotalRemainingTokens;
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
    ) public onlyWhiteListed {
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
        uint localTotalUnlockedTokens;
        uint localTotalRemainingTokens;

        for (uint i = 0; i < categories.length; ) {
            Category memory c1 = categories[i];
            uint cliffMonth = c1.lockedPeriod;
            uint vestedMonth = cliffMonth + c1.vestingPeriod;
            uint unlockingToken = 0;
            uint skipMonths = 0;

            // Check if completed month is within the vested period
            if (totalCompletedMonths > cliffMonth) {
                skipMonths = totalCompletedMonths - claimedMonth[i];

                if (totalCompletedMonths < vestedMonth) {
                    unlockingToken = c1.avgReleasedToken * skipMonths;
                } else {
                    unlockingToken = c1.remainReleasedToken;
                }

                claimedMonth[i] = totalCompletedMonths;

                localTotalUnlockedTokens += unlockingToken;
                localTotalRemainingTokens += unlockingToken;
                c1.remainReleasedToken -= unlockingToken;

                categories[i] = c1;
            }

            unchecked {
                i++;
            }
        }

        totalUnlockedTokens += localTotalUnlockedTokens;
        totalRemainingTokens += localTotalRemainingTokens;
    }

    // Internal function to mint tokens to a user
    function _mintTokens(address from, address to, uint256 amount) private {
        totalRemainingTokens -= amount;

        // Log token transfer
        tokenHolders.push(TokenHolders(to, amount, block.timestamp));

        feeToken.mint(to, amount);

        emit TokenTransfer(from, to, amount);
    }

    // The user base is expected to remain within a manageable size, ensuring that the gas limit will not be exceeded when retrieving the entire list of users.
    function allusers() external view returns (TokenHolders[] memory) {
        return tokenHolders;
    }
}
