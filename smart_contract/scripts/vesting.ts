/** @format */

import { BigNumber } from "ethers";
import { ethers } from "hardhat";
const hre = require("hardhat");

var category = [
  {
    categoryName: "Team",
    lockedPeriod: 12,
    vestingPeriod: 24,
    percentageHold: 1500,
    totalTokens: decimal(750000000),
    genesisPercentage: 0,
    genesisAmount: decimal(0),
    releasedToken: decimal(750000000),
    avgReleasedToken: decimal(31250000),
    remainReleasedToken: decimal(750000000),
  },
  {
    categoryName: "Advisors",
    lockedPeriod: 6,
    vestingPeriod: 24,
    percentageHold: 500,
    totalTokens: decimal(250000000),
    genesisPercentage: 0,
    genesisAmount: decimal(0),
    releasedToken: decimal(250000000),
    avgReleasedToken: decimal(10416666),
    remainReleasedToken: decimal(250000000),
  },
  {
    categoryName: "Partners",
    lockedPeriod: 1,
    vestingPeriod: 24,
    percentageHold: 1000,
    totalTokens: decimal(500000000),
    genesisPercentage: 0,
    genesisAmount: decimal(0),
    releasedToken: decimal(500000000),
    avgReleasedToken: decimal(20833333),
    remainReleasedToken: decimal(500000000),
  },
  {
    categoryName: "Special Private Sale",
    lockedPeriod: 6,
    vestingPeriod: 24,
    percentageHold: 300,
    totalTokens: decimal(150000000),
    genesisPercentage: 0,
    genesisAmount: decimal(0),
    releasedToken: decimal(150000000),
    avgReleasedToken: decimal(6250000),
    remainReleasedToken: decimal(150000000),
  },
  {
    categoryName: "Private Sale",
    lockedPeriod: 12,
    vestingPeriod: 24,
    percentageHold: 900,
    totalTokens: decimal(450000000),
    genesisPercentage: 0,
    genesisAmount: decimal(0),
    releasedToken: decimal(450000000),
    avgReleasedToken: decimal(18750000),
    remainReleasedToken: decimal(450000000),
  },
  {
    categoryName: "Public Launch IDO",
    lockedPeriod: 0,
    vestingPeriod: 6,
    percentageHold: 70,
    totalTokens: decimal(35000000),
    genesisPercentage: 2500,
    genesisAmount: decimal(8750000),
    releasedToken: decimal(26250000),
    avgReleasedToken: decimal(4375000),
    remainReleasedToken: decimal(26250000),
  },
  {
    categoryName: "Public Launch IEO",
    lockedPeriod: 0,
    vestingPeriod: 0,
    percentageHold: 130,
    totalTokens: decimal(65000000),
    genesisPercentage: 10000,
    genesisAmount: decimal(65000000),
    releasedToken: decimal(0),
    avgReleasedToken: decimal(0),
    remainReleasedToken: decimal(0),
  },
  {
    categoryName: "Exchanges (Liquidity)",
    lockedPeriod: 0,
    vestingPeriod: 3,
    percentageHold: 300,
    totalTokens: decimal(150000000),
    genesisPercentage: 2000,
    genesisAmount: decimal(30000000),
    releasedToken: decimal(120000000),
    avgReleasedToken: decimal(40000000),
    remainReleasedToken: decimal(120000000),
  },
  {
    categoryName: "Airdrop Rewards",
    lockedPeriod: 1,
    vestingPeriod: 12,
    percentageHold: 300,
    totalTokens: decimal(150000000),
    genesisPercentage: 100,
    genesisAmount: decimal(1500000),
    releasedToken: decimal(148500000),
    avgReleasedToken: decimal(12375000),
    remainReleasedToken: decimal(148500000),
  },
  {
    categoryName: "Incentive Rewards",
    lockedPeriod: 1,
    vestingPeriod: 48,
    percentageHold: 2000,
    totalTokens: decimal(1000000000),
    genesisPercentage: 100,
    genesisAmount: decimal(10000000),
    releasedToken: decimal(990000000),
    avgReleasedToken: decimal(20625000),
    remainReleasedToken: decimal(990000000),
  },
  {
    categoryName: "Treasury",
    lockedPeriod: 1,
    vestingPeriod: 48,
    percentageHold: 2000,
    totalTokens: decimal(1000000000),
    genesisPercentage: 0,
    genesisAmount: decimal(0),
    releasedToken: decimal(1000000000),
    avgReleasedToken: decimal(20833333),
    remainReleasedToken: decimal(1000000000),
  },
  {
    categoryName: "Reserve Fund",
    lockedPeriod: 1,
    vestingPeriod: 12,
    percentageHold: 1000,
    totalTokens: decimal(500000000),
    genesisPercentage: 300,
    genesisAmount: decimal(15000000),
    releasedToken: decimal(485000000),
    avgReleasedToken: decimal(40416666),
    remainReleasedToken: decimal(485000000),
  },
];

async function main() {
  // Deploy Token Contract
  const Token = await ethers.getContractFactory("BLUEToken");
  const token = await Token.deploy("BLUE token", "BLUE");

  await token.deployTransaction.wait(5);

  await hre.run("verify:verify", {
    address: token.address,
    contract: "contracts/BLUEToken.sol:BLUEToken",
    constructorArguments: ["BLUE token", "BLUE"],
  });

  // Deploy Token Contract
  const Vesting = await ethers.getContractFactory("Vesting");
  const vesting = await Vesting.deploy(
    token.address,
    ["0x23B708eeaa73E95D7e79B6B00735E51Ea0194200"],
    category,
  );

  await vesting.deployTransaction.wait(5);

  await hre.run("verify:verify", {
    address: vesting.address,
    contract: "contracts/Vesting.sol:Vesting",
    constructorArguments: [
      token.address,
      ["0x23B708eeaa73E95D7e79B6B00735E51Ea0194200"],
      category,
    ],
  });

  await token.setVestingcontract(vesting.address);

  console.log("BLUE Token Contract Address-> ", token.address);
  console.log("Vesting Contract Address-> ", vesting.address);
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

// BLUE Token Contract Address->  0x75e03bA9C2050a544b79965C7FaABb66BBeC6f8b
// Vesting Contract Address->  0x51555E463120A9d92947E37c2088f3e842Be190d
