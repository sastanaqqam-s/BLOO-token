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
    percentageHold: 1500,
    totalTokens: decimal(750000000),
    genesisPercentage: BigNumber.from(0),
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
  const token = await Token.deploy("BLUE token", "BLUE");

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
    categories  
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
