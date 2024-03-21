/** @format */
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { basicMethod, decimal } from "./index";

describe("BLUETOKEN Contract", () => {
  describe("Deployment", () => {
    it("Deployment should assign the correct initial values", async () => {
      const { deployer } = await loadFixture(basicMethod);
      const Tokens = await ethers.getContractFactory("BLUEToken");
      const tokens = await Tokens.deploy("BLUE token", "BLUE");

      expect(await tokens.name()).to.equal("BLUE token");
      expect(await tokens.symbol()).to.equal("BLUE");
      expect(await tokens.decimals()).to.equal(18);
      expect(await tokens.owner()).to.equal(deployer.address);
    });
  });

  describe("Mint Method", () => {
    describe("Revert", () => {
      it("should check if caller is vesting contract or not", async () => {
        const { admins, token } = await loadFixture(basicMethod);
        await expect(token.mint(admins[0].address, 1)).to.be.revertedWith(
          "BLUE: Only Vesting Contract can do this action!"
        );
      });

      it("should check Max supply overflow" , async () => {
        const { token, admins } = await loadFixture(basicMethod);
        const tokenAmount = decimal(3000000000)  
         
        await token.setVestingcontract(admins[2].address);
        await token.connect(admins[2]).mint(admins[3].address, tokenAmount);  

        await expect(token.connect(admins[2]).mint(admins[3].address, tokenAmount)).to.be.revertedWith(
          "BLUE: SUPPLY_OVERFLOW!");
      }); 

    });
    it("should mint tokens by vesting contract", async () => {
      const tokenAmount = decimal(1);
      const { deployer, token, vesting, admins } = await loadFixture(
        basicMethod
      );
      await vesting.connect(deployer).start();
      const BeforeRemainingTokens = await vesting.totalRemainingTokens();

      await vesting.transferToken(admins[0].address, tokenAmount);

      expect(await vesting.totalRemainingTokens()).to.be.equal(
        BeforeRemainingTokens.sub(tokenAmount)
      );
      expect(await vesting.totalCompletedMonths()).to.be.equal(0);
      expect(await token.balanceOf(admins[0].address)).be.equal(tokenAmount);
    });
  });

  describe("Transfer Ownership method", () => {
    describe("Revert", () => {
      it("should check if caller is owner or not", async () => {
        const { admins, token } = await loadFixture(basicMethod);

        await expect(
          token.connect(admins[0]).transferOwnership(admins[0].address)
        ).to.be.revertedWith("BLUE: Only Owner can perform this action!");
      });
      it("should check invalid address", async () => {
    
        const { token } = await loadFixture(basicMethod);
        await expect(token.transferOwnership(ethers.constants.AddressZero)).to.be.revertedWith(
          "BLUE: Invalid address!"
        );
      });
    });
    it("should transfer ownership", async () => {
      const { deployer, admins, token } = await loadFixture(basicMethod);

      // Before transferring ownership
      expect(await token.owner()).to.be.equal(deployer.address);
      await token.transferOwnership(admins[0].address);

      // After transferring ownership
      expect(await token.owner()).to.be.equal(admins[0].address);
    });
    it("should check event transfer ownership", async () => {
      const { deployer, admins, token } = await loadFixture(basicMethod);

      const event = await token.transferOwnership(admins[0].address);

      await expect(event)
        .to.emit(token, "TransferOwnership")
        .withArgs(deployer.address, admins[0].address);
    });
  });

  describe("setVestingcontract method", () => {
    describe("revert", () => {
      it("should check if caller is owner or not", async () => {
        const { deployer, admins, token,categories } = await loadFixture(basicMethod);
     
        const Vesting = await ethers.getContractFactory("Vesting");
        const reVestingContract = await Vesting.deploy(
          token.address,
          [deployer.address],
          categories
        );
        await expect(
          token.connect(admins[0]).setVestingcontract(reVestingContract.address)
        ).to.be.revertedWith("BLUE: Only Owner can perform this action!");
      });

      it("should check invalid address", async () => {
        const { token } = await loadFixture(basicMethod);
       
        await expect(token.setVestingcontract(ethers.constants.AddressZero)).to.be.revertedWith(
          "BLUE: Invalid address!"
        );
      });
    });
    it("succefully set Vesting Contract address", async () => {
      const { deployer, token, categories } = await loadFixture(basicMethod);
     
      const Vesting = await ethers.getContractFactory("Vesting");
      const reVestingContract = await Vesting.deploy(
        token.address,
        [deployer.address],
        categories
      );

      await token.setVestingcontract(reVestingContract.address);
      expect(await token.vestingContract()).to.be.equal(reVestingContract.address);
    });
  });
});
