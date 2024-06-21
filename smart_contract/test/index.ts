/** @format */

import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { BigNumberish } from "ethers";
let minutes = 60;
let seconds = 60;
let hours = 24;

let day = minutes * seconds * hours;
// let currentTime = big(await time.latest());

let currentTime = big(Math.floor(new Date().getTime() / 1000)).add(40);

var category = [
  {
    categoryName: "Team",
    lockedPeriod: 12,
    vestingPeriod: 24,
    percentageHold: 1300,
    totalTokens: decimal(650000000),
    genesisPercentage: 0,
    genesisAmount: decimal(0),
    releasedToken: decimal(650000000),
    avgReleasedToken: decimal(650000000).div(24),
    remainReleasedToken: decimal(650000000),
  },
  {
    categoryName: "Advisors",
    lockedPeriod: 6,
    vestingPeriod: 24,
    percentageHold: 300,
    totalTokens: decimal(150000000),
    genesisPercentage: 0,
    genesisAmount: decimal(0),
    releasedToken: decimal(150000000),
    avgReleasedToken: decimal(150000000).div(24),
    remainReleasedToken: decimal(150000000),
  },
  {
    categoryName: "Partners",
    lockedPeriod: 1,
    vestingPeriod: 24,
    percentageHold: 900,
    totalTokens: decimal(450000000),
    genesisPercentage: 0,
    genesisAmount: decimal(0),
    releasedToken: decimal(450000000),
    avgReleasedToken: decimal(450000000).div(24),
    remainReleasedToken: decimal(450000000),
  },
  {
    categoryName: "Private Sale",
    lockedPeriod: 6,
    vestingPeriod: 16,
    percentageHold: 300,
    totalTokens: decimal(150000000),
    genesisPercentage: 15,
    genesisAmount: decimal(22500000),
    releasedToken: decimal(127500000),
    avgReleasedToken: decimal(127500000).div(16),
    remainReleasedToken: decimal(150000000),
  },
  {
    categoryName: "Seed Sale",
    lockedPeriod: 12,
    vestingPeriod: 16,
    percentageHold: 900,
    totalTokens: decimal(450000000),
    genesisPercentage: 4,
    genesisAmount: decimal(18000000),
    releasedToken: decimal(432000000),
    avgReleasedToken: decimal(432000000).div(16),
    remainReleasedToken: decimal(450000000),
  },
  {
    categoryName: "Public Launch",
    lockedPeriod: 0,
    vestingPeriod: 3,
    percentageHold: 250,
    totalTokens: decimal(125000000),
    genesisPercentage: 50,
    genesisAmount: decimal(62500000),
    releasedToken: decimal(62500000),
    avgReleasedToken: decimal(62500000).div(3),
    remainReleasedToken: decimal(125000000),
  },
  {
    categoryName: "Exchanges (Liquidity)",
    lockedPeriod: 0,
    vestingPeriod: 3,
    percentageHold: 350,
    totalTokens: decimal(175000000),
    genesisPercentage: 40,
    genesisAmount: decimal(70000000),
    releasedToken: decimal(105000000),
    avgReleasedToken: decimal(105000000).div(3),
    remainReleasedToken: decimal(175000000),
  },
  {
    categoryName: "Airdrop Rewards",
    lockedPeriod: 1,
    vestingPeriod: 12,
    percentageHold: 300,
    totalTokens: decimal(150000000),
    genesisPercentage: 50,
    genesisAmount: decimal(75000000),
    releasedToken: decimal(75000000),
    avgReleasedToken: decimal(75000000).div(12),
    remainReleasedToken: decimal(150000000),
  },
  {
    categoryName: "Incentive Rewards",
    lockedPeriod: 1,
    vestingPeriod: 48,
    percentageHold: 2200,
    totalTokens: decimal(1100000000),
    genesisPercentage: 0,
    genesisAmount: decimal(0),
    releasedToken: decimal(1100000000),
    avgReleasedToken: decimal(1100000000).div(48),
    remainReleasedToken: decimal(1100000000),
  },
  {
    categoryName: "Treasury",
    lockedPeriod: 8,
    vestingPeriod: 36,
    percentageHold: 2000,
    totalTokens: decimal(1000000000),
    genesisPercentage: 0,
    genesisAmount: decimal(0),
    releasedToken: decimal(1000000000),
    avgReleasedToken: decimal(1000000000).div(36),
    remainReleasedToken: decimal(1000000000),
  },
  {
    categoryName: "Reserve Fund",
    lockedPeriod: 0,
    vestingPeriod: 6,
    percentageHold: 1200,
    totalTokens: decimal(600000000),
    genesisPercentage: 20,
    genesisAmount: decimal(120000000),
    releasedToken: decimal(480000000),
    avgReleasedToken: decimal(480000000).div(6),
    remainReleasedToken: decimal(600000000),
  },
];

var categories: {
  categoryName: string;
  lockedPeriod: BigNumberish;
  vestingPeriod: BigNumberish;
  percentageHold: BigNumberish;
  totalTokens: BigNumberish;
  genesisPercentage: BigNumberish;
  genesisAmount: BigNumberish;
  releasedToken: BigNumberish;
  avgReleasedToken: BigNumberish;
  remainReleasedToken: BigNumberish;
}[] = [];

export async function basicMethod() {
  // random address
  const [deployer, ...admins] = await ethers.getSigners();

  // Deploy Token Contract
  const Token = await ethers.getContractFactory("BLUEToken");
  const token = await Token.deploy("BLUE token", "BLUE", decimal(5000000000));

  // Deploy Vesting Contract
  const Vesting = await ethers.getContractFactory("Vesting");
  const vesting = await Vesting.deploy(
    token.address,
    [deployer.address],
    category,
  );

  await token.setVestingcontract(vesting.address);

  return {
    deployer,
    token,
    admins,
    vesting,
    category,
    categories,
  };
}

// convert value into Big Number with decimal places like 1^18 or 1e18
export function decimal(value: any) {
  const powValue = BigNumber.from("10").pow(18);
  return BigNumber.from(value).mul(powValue);
}

// convert value into Big Number
export function big(value: any) {
  return BigNumber.from(value);
}

// convert days in second and add on current time
export function days(value: any) {
  let dayInSecond = currentTime.add(value * day);
  return BigNumber.from(dayInSecond);
}

// convert days in second and add on current time
export function forSecond(value: any) {
  let dayInSecond = currentTime.add(value);
  return BigNumber.from(dayInSecond);
}
