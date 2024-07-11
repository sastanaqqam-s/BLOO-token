// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "./Inventory/Inventory.sol";

// Vesting contract inheriting from Inventory
contract Vesting is Inventory {
    uint256 private constant releaseInterval = 30 days; // Interval for token release in days

    /**
     * Constructor for the vesting contract and set the fee token address and MPC addresses and category data
     * @param _feeToken Fee token address
     * @param mpcAddresses MPC addresses to be whitelisted
     * @param data Category data to be set in the vesting contract
     */
    constructor(
        IBLUEToken _feeToken,
        address[] memory mpcAddresses,
        Category[] memory data
    ) {
        // Ensure the fee token address is valid
        if (address(_feeToken) == address(0)) {
            revert("Vesting: Invalid FeeToken Address!");
        }

        feeToken = _feeToken;

        if (mpcAddresses.length == 0) {
            revert("Vesting: MPC Address Length is 0!");
        }

        if (data.length != 11) {
            revert("Vesting: Category Length mismatch!");
        }

        // Add MPC addresses to the whitelist
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

    /**
     * Function to start tokenization
     * @notice The start time of tokenization is set to the current block timestamp
     * @notice The genesis amount of tokens is released
     * @notice Tokens are minted to the beneficiary
     * @notice Only whitelisted MPC addresses can call this function
     * @notice This function can only be called once
     */
    function start() external onlyWhiteListed {
        // Ensure tokenization has not already started
        require(startAt == 0, "Vesting: Tokenization already Started!");

        // Set the start time of tokenization
        startAt = block.timestamp;

        // Release initial genesis amount of tokens
        _releasedGenesisAmt();
    }

    /**
     * Internal function to release initial genesis amount of tokens
     */
    function _releasedGenesisAmt() private {
        uint totalToken;
        for (uint i = 0; i < categories.length; ) {
            Category memory c1 = categories[i];

            totalToken = c1.genesisAmount;

            if (totalToken > 0) {
                c1.totalRemainingTokens -= totalToken;
                categories[i] = c1;

                // Mint tokens to the beneficiary
                _mintTokens(i, msg.sender, c1.beneficiary, totalToken);
            }

            unchecked {
                i++;
            }
        }
    }

    /**
     * @notice Tokens are released based on vesting period after completed cliff period of each category.
     * @notice Only whitelisted MPC addresses can call this function
     * @notice Tokens are minted to the beneficiary
     */
    function released() external {
        for (uint i = 0; i < categories.length; ) {
            releasedCategoryToken(i);

            unchecked {
                i++;
            }
        }
    }

    /**
     * @dev This function is use to release tokens for a single category
     * @param categoryId Category ID to be released based on vesting period after completed cliff period
     * @notice Tokens are minted to the beneficiary
     * @notice Only whitelisted MPC addresses can call this function
     */
    function releasedCategoryToken(uint categoryId) public onlyWhiteListed {
        // Ensure distribution has started
        require(startAt > 0, "Vesting: Distribution not started yet!");

        Category memory c1 = categories[categoryId];

        uint unlockingTokens = calculateUnlockedToken(categoryId, c1);

        // Check if enough tokens are unlocked for transfer
        if (unlockingTokens > 0) {
            c1.totalRemainingTokens -= unlockingTokens;

            categories[categoryId] = c1;

            // Mint tokens to the user
            _mintTokens(
                categoryId,
                msg.sender,
                c1.beneficiary,
                unlockingTokens
            );
        }
    }

    /**
     * Internal function to calculate unlocked tokens
     * @param categoryId Category ID to be released based on vesting period after completed cliff period
     */
    function calculateUnlockedToken(
        uint categoryId,
        Category memory c1
    ) private returns (uint unlockingToken) {
        uint completedMonth = (block.timestamp - startAt) / releaseInterval;

        if (completedMonth > totalCompletedMonths[categoryId]) {
            totalCompletedMonths[categoryId] = completedMonth;
            unlockingToken = _checkVestedPeriod(
                categoryId,
                totalCompletedMonths[categoryId],
                c1
            );
        }
    }

    // Internal function to check and release tokens according to vested periods
    function _checkVestedPeriod(
        uint categoryId,
        uint completedMonths,
        Category memory c1
    ) private returns (uint unlockingToken) {
        uint cliffMonth = c1.lockedPeriod;
        uint vestedMonth = cliffMonth + c1.vestingPeriod;
        uint skipMonths = 0;

        // Check if the completed month is within the vested period
        if (completedMonths > cliffMonth) {
            skipMonths = completedMonths - claimedMonth[categoryId];

            if (completedMonths < vestedMonth) {
                unlockingToken = c1.avgReleasedToken * skipMonths;
            } else {
                unlockingToken = c1.totalRemainingTokens;
            }

            claimedMonth[categoryId] = completedMonths;
        }

        return unlockingToken;
    }

    // Internal function to mint tokens to a beneficiary address based on category ID
    function _mintTokens(
        uint categoryId,
        address from,
        address to,
        uint256 amount
    ) private {
        // Log token transfer
        tokenHolders.push(
            TokenHolders(categoryId, to, amount, block.timestamp)
        );

        feeToken.mint(to, amount);

        emit TokenTransfer(from, to, amount);
    }

    // Function to retrieve the entire list of users and their token holding details
    function allusers() external view returns (TokenHolders[] memory) {
        return tokenHolders;
    }
}
