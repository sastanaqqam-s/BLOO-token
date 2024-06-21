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

export async function basicMethod() {
  // random address
  const [deployer, ...admins] = await ethers.getSigners();

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
      beneficiary: admins[0].address,
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
      beneficiary: admins[1].address,
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
      beneficiary: admins[2].address,
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
      beneficiary: admins[3].address,
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
      beneficiary: admins[4].address,
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
      beneficiary: admins[5].address,
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
      beneficiary: admins[6].address,
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
      beneficiary: admins[7].address,
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
      beneficiary: admins[8].address,
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
      beneficiary: admins[9].address,
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
      beneficiary: admins[10].address,
    },
  ];

  // Deploy Token Contract
  const Token = await ethers.getContractFactory("BLUEToken");
  const token = await Token.deploy("BLUE token", "$BLUE", decimal(5000000000));

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
