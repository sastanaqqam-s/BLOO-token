/** @format */
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { BigNumber, BigNumberish } from "ethers";
import { ethers } from "hardhat";
import { basicMethod, decimal, forSecond, big } from "./index";
import { deploy } from "@openzeppelin/hardhat-upgrades/dist/utils";
import { exit } from "process";

describe("Vesting Contract", () => {
  describe("Should check values at Deployment of Vesting Contract", () => {
    it("should check fee token address invalid", async () => {
      const { deployer, token, category } = await loadFixture(basicMethod);

      // Deploy Vesting Contract
      const Vesting = await ethers.getContractFactory("Vesting");

      await expect(
        Vesting.deploy(
          "0x0000000000000000000000000000000000000000",
          [deployer.address],
          category,
        ),
      ).to.be.revertedWith("Vesting: Invalid FeeToken Address!");
    });

    it("should check mpc wallet address length is 0", async () => {
      const { deployer, token, category } = await loadFixture(basicMethod);

      // Deploy Vesting Contract
      const Vesting = await ethers.getContractFactory("Vesting");

      await expect(
        Vesting.deploy(deployer.address, [], category),
      ).to.be.revertedWith("Vesting: MPC Address Length is 0!");
    });

    it("should check Category length Mismatch", async () => {
      const { token, deployer, admins } = await loadFixture(basicMethod);

      var category = [
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

      // Deploy Vesting Contract
      const Vesting = await ethers.getContractFactory("Vesting");

      await expect(
        Vesting.deploy(token.address, [deployer.address], category),
      ).to.be.revertedWith("Vesting: Category Length mismatch!");
    });

    it("should check mpc wallet address invalid", async () => {
      const { deployer, token, category } = await loadFixture(basicMethod);

      // Deploy Vesting Contract
      const Vesting = await ethers.getContractFactory("Vesting");

      await expect(
        Vesting.deploy(
          token.address,
          ["0x0000000000000000000000000000000000000000"],
          category,
        ),
      ).to.be.revertedWith("Vesting: Invalid MPC Address!");
    });

    it("should check token supply limit exceed", async () => {
      const { deployer, token } = await loadFixture(basicMethod);

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
          releasedToken: decimal(4800000000),
          avgReleasedToken: decimal(480000000).div(6),
          remainReleasedToken: decimal(600000000),
        },
      ];

      // Deploy Vesting Contract
      const Vesting = await ethers.getContractFactory("Vesting");

      await expect(
        Vesting.deploy(token.address, [deployer.address], category),
      ).to.be.revertedWith("Vesting: Total tokens exceeds max supply!");
    });
  });

  describe("Should update values at Deployment of Vesting Contract", () => {
    it("Should check updated whiteListed Address", async () => {
      const { deployer, vesting } = await loadFixture(basicMethod);
      expect(await vesting.whiteListed(deployer.address)).to.be.true;
    });

    it("Should update BlueToken address", async () => {
      const { token, vesting } = await loadFixture(basicMethod);
      expect(await vesting.feeToken()).to.equal(token.address);
    });

    it("Should update Category data", async () => {
      const { vesting, category } = await loadFixture(basicMethod);
      const vestingCategory = await vesting.getCategoryDetail();

      expect(vestingCategory.length).to.equal(category.length);

      for (let i = 0; i < vestingCategory.length; i++) {
        expect(vestingCategory[i].categoryName).to.equal(
          category[i].categoryName,
        );
        expect(vestingCategory[i].lockedPeriod).to.equal(
          category[i].lockedPeriod,
        );
        expect(vestingCategory[i].vestingPeriod).to.equal(
          category[i].vestingPeriod,
        );
        expect(vestingCategory[i].percentageHold).to.equal(
          category[i].percentageHold,
        );
        expect(vestingCategory[i].totalTokens).to.equal(
          category[i].totalTokens,
        );
        expect(vestingCategory[i].genesisPercentage).to.equal(
          category[i].genesisPercentage,
        );
        expect(vestingCategory[i].genesisAmount).to.equal(
          category[i].genesisAmount,
        );
        expect(vestingCategory[i].releasedToken).to.equal(
          category[i].releasedToken,
        );
        expect(vestingCategory[i].avgReleasedToken).to.equal(
          category[i].avgReleasedToken,
        );
        expect(vestingCategory[i].remainReleasedToken).to.equal(
          category[i].remainReleasedToken,
        );
      }
    });
  });

  describe("start function", () => {
    describe("revert", () => {
      it("Should check caller is whiteListed caller or not", async () => {
        const { vesting, admins } = await loadFixture(basicMethod);

        await expect(vesting.connect(admins[0]).start()).to.revertedWith(
          "Vesting: Only Whitelisted Address can perform this action!",
        );
      });

      it("Should check Tokenization already Started oe not", async () => {
        const { deployer, vesting } = await loadFixture(basicMethod);

        await vesting.connect(deployer).start();
        await expect(vesting.connect(deployer).start()).to.revertedWith(
          "Vesting: Tokenization already Started!",
        );
      });
    });

    it("Should run Start Menthod expected", async () => {
      const { deployer, token, vesting } = await loadFixture(basicMethod);

      expect(await vesting.totalRemainingTokens()).to.be.equal(
        await vesting.totalUnlockedTokens(),
      );
      expect(await vesting.totalCompletedMonths()).to.be.equal(0);

      await vesting.start();
      expect(await time.latest()).to.be.equal(await vesting.startAt());
      //Genesis token released
      expect(await vesting.totalRemainingTokens()).to.be.equal(
        await vesting.totalUnlockedTokens(),
      );
      expect(await vesting.totalCompletedMonths()).to.be.equal(0);

      const vestingCategory = await vesting.getCategoryDetail();
      var GenesisAmount = big(0);

      for (let i = 0; i < vestingCategory.length; i++) {
        GenesisAmount = GenesisAmount.add(vestingCategory[i].genesisAmount);
      }
      expect(await vesting.totalUnlockedTokens()).to.be.equal(GenesisAmount);
      expect(await vesting.totalRemainingTokens()).to.be.equal(GenesisAmount);
    });
  });

  describe("multiTransferToken function", () => {
    describe("revert", () => {
      it("should check caller is whitelisted or not", async () => {
        const { vesting, admins } = await loadFixture(basicMethod);
        const tokens = decimal(1);

        await expect(
          vesting
            .connect(admins[0])
            .multiTransferToken([admins[1].address, admins[2].address], tokens),
        ).to.be.revertedWith(
          "Vesting: Only Whitelisted Address can perform this action!",
        );
      });

      it("should check invalid token amount", async () => {
        const { vesting, admins } = await loadFixture(basicMethod);
        const tokens = decimal(0);

        await expect(
          vesting.multiTransferToken(
            [admins[1].address, admins[2].address],
            tokens,
          ),
        ).to.be.revertedWith("Vesting: Invalid tokenAmount");
      });
    });

    it("should multi transfer ", async () => {
      const { vesting, token, admins } = await loadFixture(basicMethod);
      const tokens = decimal(1);
      await vesting.start();
      const arrAddress = [
        admins[1].address,
        admins[2].address,
        admins[3].address,
      ];

      expect(await vesting.totalUnlockedTokens()).to.be.equal(
        await vesting.totalRemainingTokens(),
      );

      await vesting.multiTransferToken(arrAddress, tokens);
      const unlockToken = await vesting.totalUnlockedTokens();
      const remeaningToken = await vesting.totalRemainingTokens();

      expect(remeaningToken).to.be.equal(
        unlockToken.sub(tokens.mul(arrAddress.length)),
      );

      for (let i = 0; i < arrAddress.length; i++) {
        expect(await token.balanceOf(arrAddress[i])).to.be.equal(tokens);
      }
    });
  });

  describe("transferToken function", () => {
    const tokenAmount = decimal(1);
    describe("revert", () => {
      it("should check caller is WhiteListed or not", async () => {
        const { deployer, token, vesting, admins } = await loadFixture(
          basicMethod,
        );
        await vesting.connect(deployer).start();
        await expect(
          vesting
            .connect(admins[1])
            .transferToken(admins[0].address, tokenAmount),
        ).to.revertedWith(
          "Vesting: Only Whitelisted Address can perform this action!",
        );
      });
      it("should check Distribution is started or not", async () => {
        const { vesting, admins } = await loadFixture(basicMethod);
        await expect(
          vesting.transferToken(admins[0].address, tokenAmount),
        ).to.revertedWith("Vesting: Distribution not started yet!");
      });
      it("should check invalid token amount", async () => {
        const { deployer, vesting, admins } = await loadFixture(basicMethod);
        const tokens = decimal(0);
        await vesting.connect(deployer).start();

        await expect(
          vesting.transferToken(admins[0].address, tokens),
        ).to.be.revertedWith("Vesting: Invalid tokenAmount");
      });
      it("Should check unlocked tokens ", async () => {
        const { deployer, vesting, admins } = await loadFixture(basicMethod);
        const Tokens = decimal(368000000);
        await vesting.connect(deployer).start();
        await vesting.transferToken(admins[0].address, Tokens);

        await expect(
          vesting.transferToken(admins[0].address, tokenAmount),
        ).to.be.revertedWith(
          "Vesting: Not enough tokens have been unlocked at the moment!",
        );
      });
    });

    it("Should run transferToken function for genesis released tokens ", async () => {
      const { deployer, token, vesting, admins } = await loadFixture(
        basicMethod,
      );
      await vesting.connect(deployer).start();
      const beforeRemainingTokens = await vesting.totalRemainingTokens();

      await vesting.transferToken(admins[0].address, tokenAmount);

      expect(await vesting.totalRemainingTokens()).to.be.equal(
        beforeRemainingTokens.sub(tokenAmount),
      );
      expect(await vesting.totalCompletedMonths()).to.be.equal(0);
      expect(await token.balanceOf(admins[0].address)).be.equal(tokenAmount);

      //after ReTransfering amount
      await vesting.transferToken(admins[0].address, tokenAmount);

      expect(await vesting.totalRemainingTokens()).to.be.equal(
        beforeRemainingTokens.sub(tokenAmount).sub(tokenAmount),
      );
      expect(await vesting.totalCompletedMonths()).to.be.equal(0);
      expect(await token.balanceOf(admins[0].address)).be.equal(
        tokenAmount.mul(2),
      );

      // if transfer more than remeaning tokens
      await expect(
        vesting.transferToken(
          admins[0].address,
          (await vesting.totalRemainingTokens()).add(1),
        ),
      ).to.be.revertedWith(
        "Vesting: Not enough tokens have been unlocked at the moment!",
      );
    });
    it("Should run transfer function expected for some cliff and vesting period", async () => {
      const { deployer, token, vesting, admins } = await loadFixture(
        basicMethod,
      );
      await vesting.connect(deployer).start();

      var TotalUnlocked = await vesting.totalUnlockedTokens();
      var totalTransferAmount = big(0);

      // at start time 0th month 1st time
      await vesting.transferToken(admins[0].address, tokenAmount);
      totalTransferAmount = totalTransferAmount.add(tokenAmount);
      expect(totalTransferAmount).to.be.equal(tokenAmount);
      expect(await token.balanceOf(admins[0].address)).to.be.equal(tokenAmount);
      expect(totalTransferAmount).to.be.equal(
        TotalUnlocked.sub(await vesting.totalRemainingTokens()),
      );

      // at start time 0th month 2nd time
      await vesting.transferToken(admins[0].address, tokenAmount);
      totalTransferAmount = totalTransferAmount.add(tokenAmount);

      expect(totalTransferAmount).to.be.equal(tokenAmount.mul(2));
      expect(await token.balanceOf(admins[0].address)).to.be.equal(
        tokenAmount.mul(2),
      );
      expect(totalTransferAmount).to.be.equal(
        TotalUnlocked.sub(await vesting.totalRemainingTokens()),
      );
    });
    it("Should run transfer function expected for cliff and vesting period till Last Vested Month", async () => {
      const { deployer, token, vesting, admins } = await loadFixture(
        basicMethod,
      );

      var expectedTotalTransferAmount = big(0);
      const vestingCategory = await vesting.getCategoryDetail();

      async function transfer() {
        await vesting.transferToken(admins[1].address, tokenAmount);
        return tokenAmount;
      }

      function findMaxVestingMonth() {
        var maxVestingPeriod = 0;
        for (let i = 0; i < vestingCategory.length; i++) {
          if (Number(vestingCategory[i].vestingPeriod) > maxVestingPeriod) {
            maxVestingPeriod = Number(vestingCategory[i].vestingPeriod);
          }
        }
        return maxVestingPeriod;
      }
      let maxVestingMonth = findMaxVestingMonth();

      await vesting.connect(deployer).start();

      for (let i = 1; i <= maxVestingMonth + 1; i++) {
        await time.increaseTo(forSecond(2592000 * i));
        expectedTotalTransferAmount = expectedTotalTransferAmount.add(
          await transfer(),
        );

        expect(expectedTotalTransferAmount).to.be.equal(tokenAmount.mul(i));
        expect(await token.balanceOf(admins[1].address)).to.be.equal(
          tokenAmount.mul(i),
        );
        expect(await vesting.totalRemainingTokens()).to.be.equal(
          (await vesting.totalUnlockedTokens()).sub(
            expectedTotalTransferAmount,
          ),
        );
        expect(expectedTotalTransferAmount).to.be.equal(
          (await vesting.totalUnlockedTokens()).sub(
            await vesting.totalRemainingTokens(),
          ),
        );
      }
      expect(await vesting.totalUnlockedTokens()).to.be.equal(
        await token.max_supply(),
      );
      expect(await vesting.totalRemainingTokens()).to.be.equal(
        (await vesting.totalUnlockedTokens()).sub(expectedTotalTransferAmount),
      );
      expect(expectedTotalTransferAmount).to.be.equal(
        await token.balanceOf(admins[1].address),
      );
    });

    it("Should check event TokenTransfer", async () => {
      const { deployer, token, vesting, admins } = await loadFixture(
        basicMethod,
      );
      await vesting.connect(deployer).start();
      const b4Remaining = await vesting.totalRemainingTokens();

      const event = await vesting.transferToken(admins[0].address, tokenAmount);

      expect(await vesting.totalRemainingTokens()).to.be.equal(
        b4Remaining.sub(tokenAmount),
      );
      expect(await vesting.totalCompletedMonths()).to.be.equal(0);
      expect(await token.balanceOf(admins[0].address)).be.equal(tokenAmount);

      // event check
      await expect(event)
        .to.emit(vesting, "TokenTransfer")
        .withArgs(deployer.address, admins[0].address, tokenAmount);
    });
  });

  describe("allusers function", async () => {
    it("should return all users", async () => {
      const { vesting, admins } = await loadFixture(basicMethod);
      const tokens = decimal(1);

      await vesting.start();

      await vesting.transferToken(admins[0].address, tokens);
      await vesting.transferToken(admins[1].address, tokens);
      await vesting.transferToken(admins[2].address, tokens);
      await vesting.transferToken(admins[0].address, tokens);

      const tokenHolders = await vesting.allusers();

      expect(tokenHolders[0].users).to.be.equal(admins[0].address);
      expect(tokenHolders[0].tokens).to.be.equal(tokens);

      expect(tokenHolders[1].users).to.be.equal(admins[1].address);
      expect(tokenHolders[1].tokens).to.be.equal(tokens);

      expect(tokenHolders[2].users).to.be.equal(admins[2].address);
      expect(tokenHolders[2].tokens).to.be.equal(tokens);

      expect(tokenHolders[3].users).to.be.equal(admins[0].address);
      expect(tokenHolders[3].tokens).to.be.equal(tokens);
    });
  });
});
