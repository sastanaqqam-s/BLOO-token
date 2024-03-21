/** @format */

import { ethers } from "hardhat";
const hre = require("hardhat");

async function main() {
  //Deploy BasicContract Contract
  const Token = await ethers.getContractFactory("BLUEToken");
  const token = await Token.deploy();

  await token.deployTransaction.wait(5);

  await hre.run("verify:verify", {
    address: token.address,
    contract: "contracts/BLUEToken.sol:BLUEToken",
  });

  console.log("BLUE Token Contract Address-> ", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log("Deploy error-> ", error);
    process.exit(1);
  });

// https://mumbai.polygonscan.com/address/0x20ab6395bf7244fE7711854FAc829179557d1D88#code
