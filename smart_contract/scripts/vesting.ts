/** @format */

import { BigNumber } from "ethers";
import { ethers } from "hardhat";
const hre = require("hardhat");

var category = [
  {
    categoryName: "Team",
    lockedPeriod: 12,
    vestingPeriod: 24,
    totalTokens: decimal(650000000),
    genesisAmount: decimal(0),
    releasedToken: decimal(650000000),
    avgReleasedToken: decimal(650000000).div(24),
    totalRemainingTokens: decimal(650000000),
    beneficiary: "0x0000000000000000000000000000000000000000",
  },
  {
    categoryName: "Advisors",
    lockedPeriod: 6,
    vestingPeriod: 24,
    totalTokens: decimal(150000000),
    genesisAmount: decimal(0),
    releasedToken: decimal(150000000),
    avgReleasedToken: decimal(150000000).div(24),
    totalRemainingTokens: decimal(150000000),
    beneficiary: "0x0000000000000000000000000000000000000000",
  },
  {
    categoryName: "Partners",
    lockedPeriod: 1,
    vestingPeriod: 24,
    totalTokens: decimal(450000000),
    genesisAmount: decimal(0),
    releasedToken: decimal(450000000),
    avgReleasedToken: decimal(450000000).div(24),
    totalRemainingTokens: decimal(450000000),
    beneficiary: "0x0000000000000000000000000000000000000000",
  },
  {
    categoryName: "Private Sale",
    lockedPeriod: 6,
    vestingPeriod: 16,
    totalTokens: decimal(150000000),
    genesisAmount: decimal(22500000),
    releasedToken: decimal(127500000),
    avgReleasedToken: decimal(127500000).div(16),
    totalRemainingTokens: decimal(150000000),
    beneficiary: "0x0000000000000000000000000000000000000000",
  },
  {
    categoryName: "Seed Sale",
    lockedPeriod: 12,
    vestingPeriod: 16,
    totalTokens: decimal(450000000),
    genesisAmount: decimal(18000000),
    releasedToken: decimal(432000000),
    avgReleasedToken: decimal(432000000).div(16),
    totalRemainingTokens: decimal(450000000),
    beneficiary: "0x0000000000000000000000000000000000000000",
  },
  {
    categoryName: "Public Launch",
    lockedPeriod: 0,
    vestingPeriod: 3,
    totalTokens: decimal(125000000),
    genesisAmount: decimal(62500000),
    releasedToken: decimal(62500000),
    avgReleasedToken: decimal(62500000).div(3),
    totalRemainingTokens: decimal(125000000),
    beneficiary: "0x0000000000000000000000000000000000000000",
  },
  {
    categoryName: "Exchanges (Liquidity)",
    lockedPeriod: 0,
    vestingPeriod: 3,
    totalTokens: decimal(175000000),
    genesisAmount: decimal(70000000),
    releasedToken: decimal(105000000),
    avgReleasedToken: decimal(105000000).div(3),
    totalRemainingTokens: decimal(175000000),
    beneficiary: "0x0000000000000000000000000000000000000000",
  },
  {
    categoryName: "Airdrop Rewards",
    lockedPeriod: 1,
    vestingPeriod: 12,
    totalTokens: decimal(150000000),
    genesisAmount: decimal(75000000),
    releasedToken: decimal(75000000),
    avgReleasedToken: decimal(75000000).div(12),
    totalRemainingTokens: decimal(150000000),
    beneficiary: "0x0000000000000000000000000000000000000000",
  },
  {
    categoryName: "Incentive Rewards",
    lockedPeriod: 1,
    vestingPeriod: 48,
    totalTokens: decimal(1100000000),
    genesisAmount: decimal(0),
    releasedToken: decimal(1100000000),
    avgReleasedToken: decimal(1100000000).div(48),
    totalRemainingTokens: decimal(1100000000),
    beneficiary: "0x0000000000000000000000000000000000000000",
  },
  {
    categoryName: "Treasury",
    lockedPeriod: 8,
    vestingPeriod: 36,
    totalTokens: decimal(1000000000),
    genesisAmount: decimal(0),
    releasedToken: decimal(1000000000),
    avgReleasedToken: decimal(1000000000).div(36),
    totalRemainingTokens: decimal(1000000000),
    beneficiary: "0x0000000000000000000000000000000000000000",
  },
  {
    categoryName: "Reserve Fund",
    lockedPeriod: 0,
    vestingPeriod: 6,
    totalTokens: decimal(600000000),
    genesisAmount: decimal(120000000),
    releasedToken: decimal(480000000),
    avgReleasedToken: decimal(480000000).div(6),
    totalRemainingTokens: decimal(600000000),
    beneficiary: "0x0000000000000000000000000000000000000000",
  },
];

async function main() {
  // Deploy Token Contract
  const Token = await ethers.getContractFactory("BLUEToken");
  const token = await Token.deploy("BLUE token", "BLUE");

  console.log("BLUE Token Contract Address-> ", token.address);

  await token.deployTransaction.wait(5);

  await hre.run("verify:verify", {
    address: token.address,
    contract: "contracts/BLUEToken.sol:BLUEToken",
    constructorArguments: ["BLUE token", "BLUE", decimal(5000000000)],
  });

  // Deploy Token Contract
  const Vesting = await ethers.getContractFactory("Vesting");
  const vesting = await Vesting.deploy(
    token.address,
    [
      "0x0000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000",
    ],
    category,
  );

  console.log("Vesting Contract Address-> ", vesting.address);

  await vesting.deployTransaction.wait(5);

  await token.setVestingcontract(vesting.address);

  await hre.run("verify:verify", {
    address: vesting.address,
    contract: "contracts/Vesting.sol:Vesting",
    constructorArguments: [
      token.address,
      [
        "0x0000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000",
      ],
      category,
    ],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log("Deploy error-> ", error);
    process.exit(1);
  });

function decimal(value: any) {
  const powValue = BigNumber.from("10").pow(18);
  return BigNumber.from(value).mul(powValue);
}

// BLUE Token Contract Address->
// Vesting Contract Address->
