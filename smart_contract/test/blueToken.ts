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
      const tokens = await Tokens.deploy(
        "BLUE token",
        "BLUE",
        decimal(5000000000),
      );

      expect(await tokens.name()).to.equal("BLUE token");
      expect(await tokens.symbol()).to.equal("BLUE");
      expect(await tokens.decimals()).to.equal(18);
      expect(await tokens.owner()).to.equal(deployer.address);
    });
  });

  describe("Mint Method", () => {
    it("should mint tokens by vesting contract", async () => {
      const tokenAmount = decimal(1);
      const { deployer, token, vesting, admins } = await loadFixture(
        basicMethod,
      );
      await vesting.connect(deployer).start();
      const BeforeRemainingTokens = await vesting.totalRemainingTokens();

      await vesting.transferToken(admins[0].address, tokenAmount);

      expect(await vesting.totalRemainingTokens()).to.be.equal(
        BeforeRemainingTokens.sub(tokenAmount),
      );
      expect(await vesting.totalCompletedMonths()).to.be.equal(0);
      expect(await token.balanceOf(admins[0].address)).be.equal(tokenAmount);
    });

    it("should check if caller is vesting contract or not", async () => {
      const { admins, token } = await loadFixture(basicMethod);
      await expect(token.mint(admins[0].address, 1)).to.be.revertedWith(
        "BLUE: Only Vesting Contract can do this action!",
      );
    });

    it("should check if supply overflow", async () => {
      const { deployer } = await loadFixture(basicMethod);

      // Deploy Token Contract
      const Token = await ethers.getContractFactory("BLUEToken");
      const token = await Token.deploy(
        "BLUE token",
        "BLUE",
        decimal(5000000000),
      );

      await token.setVestingcontract(deployer.address);

      await expect(
        token.mint(deployer.address, decimal(5000000001)),
      ).to.be.revertedWith("BLUE: SUPPLY_OVERFLOW!");
    });
  });

  describe("Transfer Ownership method", () => {
    describe("Revert", () => {
      it("should check if caller is owner or not", async () => {
        const { admins, token } = await loadFixture(basicMethod);

        await expect(
          token.connect(admins[0]).transferOwnership(admins[0].address),
        ).to.be.revertedWith("BLUE: Only Owner can perform this action!");
      });
      it("should check invalid address", async () => {
        const { token } = await loadFixture(basicMethod);
        await expect(
          token.transferOwnership(ethers.constants.AddressZero),
        ).to.be.revertedWith("BLUE: Invalid address!");
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
    it("should check vesting contract address", async () => {
      const { token, vesting } = await loadFixture(basicMethod);

      expect(await token.vestingContract()).to.equal(vesting.address);
    });

    it("should check initialized status", async () => {
      const { token } = await loadFixture(basicMethod);

      expect(await token.initialized()).to.equal(true);
    });

    it("should check event", async () => {
      const { deployer, vesting } = await loadFixture(basicMethod);

      // Deploy Token Contract
      const Token = await ethers.getContractFactory("BLUEToken");
      const token = await Token.deploy(
        "BLUE token",
        "BLUE",
        decimal(5000000000),
      );
      let event = await token.setVestingcontract(vesting.address);

      expect(event)
        .to.emit(token, "SetVestingcontract")
        .withArgs(deployer.address, vesting.address);
    });

    describe("Revert Condition in Set Vesting Contract method", () => {
      it("should check only owner can set vesting contract", async () => {
        const { token, admins } = await loadFixture(basicMethod);

        await expect(
          token.connect(admins[0]).setVestingcontract(admins[1].address),
        ).to.be.revertedWith("BLUE: Only Owner can perform this action!");
      });

      it("should check vesting contract address already Initialized", async () => {
        const { token, deployer } = await loadFixture(basicMethod);

        await expect(
          token.connect(deployer).setVestingcontract(deployer.address),
        ).to.be.revertedWith("BLUE: Vesting Contract Already Initialized!");
      });

      it("should check vesting contract address is invalid", async () => {
        const { token, deployer } = await loadFixture(basicMethod);

        await expect(
          token
            .connect(deployer)
            .setVestingcontract("0x0000000000000000000000000000000000000000"),
        ).to.be.revertedWith("BLUE: Invalid Address!");
      });
    });
  });
});
