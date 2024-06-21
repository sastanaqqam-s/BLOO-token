/** @format */
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { basicMethod, decimal, forSecond, big } from "./index";
import { exit } from "process";
import { clear } from "console";

describe("Vesting Contract", () => {
  describe("Constructor Details", () => {
    it("Should check All Category details", async () => {
      const { vesting, admins } = await loadFixture(basicMethod);

      expect(await vesting.getCategoryDetail()).to.deep.members([
        [
          "Team",
          big(12),
          big(24),
          decimal(650000000),
          decimal(0),
          decimal(650000000),
          decimal(650000000).div(24),
          decimal(650000000),
          admins[0].address,
        ],
        [
          "Advisors",
          big(6),
          big(24),
          decimal(150000000),
          decimal(0),
          decimal(150000000),
          decimal(150000000).div(24),
          decimal(150000000),
          admins[1].address,
        ],
        [
          "Partners",
          big(1),
          big(24),
          decimal(450000000),
          decimal(0),
          decimal(450000000),
          decimal(450000000).div(24),
          decimal(450000000),
          admins[2].address,
        ],
        [
          "Private Sale",
          big(6),
          big(16),
          decimal(150000000),
          decimal(22500000),
          decimal(127500000),
          decimal(127500000).div(16),
          decimal(150000000),
          admins[3].address,
        ],
        [
          "Seed Sale",
          big(12),
          big(16),
          decimal(450000000),
          decimal(18000000),
          decimal(432000000),
          decimal(432000000).div(16),
          decimal(450000000),
          admins[4].address,
        ],
        [
          "Public Launch",
          big(0),
          big(3),
          decimal(125000000),
          decimal(62500000),
          decimal(62500000),
          decimal(62500000).div(3),
          decimal(125000000),
          admins[5].address,
        ],
        [
          "Exchanges (Liquidity)",
          big(0),
          big(3),
          decimal(175000000),
          decimal(70000000),
          decimal(105000000),
          decimal(105000000).div(3),
          decimal(175000000),
          admins[6].address,
        ],
        [
          "Airdrop Rewards",
          big(1),
          big(12),
          decimal(150000000),
          decimal(75000000),
          decimal(75000000),
          decimal(75000000).div(12),
          decimal(150000000),
          admins[7].address,
        ],
        [
          "Incentive Rewards",
          big(1),
          big(48),
          decimal(1100000000),
          decimal(0),
          decimal(1100000000),
          decimal(1100000000).div(48),
          decimal(1100000000),
          admins[8].address,
        ],
        [
          "Treasury",
          big(8),
          big(36),
          decimal(1000000000),
          decimal(0),
          decimal(1000000000),
          decimal(1000000000).div(36),
          decimal(1000000000),
          admins[9].address,
        ],
        [
          "Reserve Fund",
          big(0),
          big(6),
          decimal(600000000),
          decimal(120000000),
          decimal(480000000),
          decimal(480000000).div(6),
          decimal(600000000),
          admins[10].address,
        ],
      ]);
    });

    it("Should check Team category details", async () => {
      const { vesting, admins } = await loadFixture(basicMethod);

      expect(await vesting.categories(0)).to.deep.members([
        "Team",
        big(12),
        big(24),
        decimal(650000000),
        decimal(0),
        decimal(650000000),
        decimal(650000000).div(24),
        decimal(650000000),
        admins[0].address,
      ]);
    });

    it("Should check Advisors category details", async () => {
      const { vesting, admins } = await loadFixture(basicMethod);

      expect(await vesting.categories(1)).to.deep.members([
        "Advisors",
        big(6),
        big(24),
        decimal(150000000),
        decimal(0),
        decimal(150000000),
        decimal(150000000).div(24),
        decimal(150000000),
        admins[1].address,
      ]);
    });

    it("Should check Partners category details", async () => {
      const { vesting, admins } = await loadFixture(basicMethod);

      expect(await vesting.categories(2)).to.deep.members([
        "Partners",
        big(1),
        big(24),
        decimal(450000000),
        decimal(0),
        decimal(450000000),
        decimal(450000000).div(24),
        decimal(450000000),
        admins[2].address,
      ]);
    });

    it("Should check Private Sale category details", async () => {
      const { vesting, admins } = await loadFixture(basicMethod);

      expect(await vesting.categories(3)).to.deep.members([
        "Private Sale",
        big(6),
        big(16),
        decimal(150000000),
        decimal(22500000),
        decimal(127500000),
        decimal(127500000).div(16),
        decimal(150000000),
        admins[3].address,
      ]);
    });

    it("Should check Seed Sale category details", async () => {
      const { vesting, admins } = await loadFixture(basicMethod);

      expect(await vesting.categories(4)).to.deep.members([
        "Seed Sale",
        big(12),
        big(16),
        decimal(450000000),
        decimal(18000000),
        decimal(432000000),
        decimal(432000000).div(16),
        decimal(450000000),
        admins[4].address,
      ]);
    });

    it("Should check Public Launch category details", async () => {
      const { vesting, admins } = await loadFixture(basicMethod);

      expect(await vesting.categories(5)).to.deep.members([
        "Public Launch",
        big(0),
        big(3),
        decimal(125000000),
        decimal(62500000),
        decimal(62500000),
        decimal(62500000).div(3),
        decimal(125000000),
        admins[5].address,
      ]);
    });

    it("Should check Exchanges (Liquidity) category details", async () => {
      const { vesting, admins } = await loadFixture(basicMethod);

      expect(await vesting.categories(6)).to.deep.members([
        "Exchanges (Liquidity)",
        big(0),
        big(3),
        decimal(175000000),
        decimal(70000000),
        decimal(105000000),
        decimal(105000000).div(3),
        decimal(175000000),
        admins[6].address,
      ]);
    });

    it("Should check Airdrop Rewards category details", async () => {
      const { vesting, admins } = await loadFixture(basicMethod);

      expect(await vesting.categories(7)).to.deep.members([
        "Airdrop Rewards",
        big(1),
        big(12),
        decimal(150000000),
        decimal(75000000),
        decimal(75000000),
        decimal(75000000).div(12),
        decimal(150000000),
        admins[7].address,
      ]);
    });

    it("Should check Incentive Rewards category details", async () => {
      const { vesting, admins } = await loadFixture(basicMethod);

      expect(await vesting.categories(8)).to.deep.members([
        "Incentive Rewards",
        big(1),
        big(48),
        decimal(1100000000),
        decimal(0),
        decimal(1100000000),
        decimal(1100000000).div(48),
        decimal(1100000000),
        admins[8].address,
      ]);
    });

    it("Should check Treasury category details", async () => {
      const { vesting, admins } = await loadFixture(basicMethod);

      expect(await vesting.categories(9)).to.deep.members([
        "Treasury",
        big(8),
        big(36),
        decimal(1000000000),
        decimal(0),
        decimal(1000000000),
        decimal(1000000000).div(36),
        decimal(1000000000),
        admins[9].address,
      ]);
    });

    it("Should check Reserve Fund category details", async () => {
      const { vesting, admins } = await loadFixture(basicMethod);

      expect(await vesting.categories(10)).to.deep.members([
        "Reserve Fund",
        big(0),
        big(6),
        decimal(600000000),
        decimal(120000000),
        decimal(480000000),
        decimal(480000000).div(6),
        decimal(600000000),
        admins[10].address,
      ]);
    });

    it("Should check Fee Token Address", async () => {
      const { vesting, token } = await loadFixture(basicMethod);

      expect(await vesting.feeToken()).to.equal(token.address);
    });

    it("Should check White Listed Address Status", async () => {
      const { vesting, deployer } = await loadFixture(basicMethod);

      expect(await vesting.whiteListed(deployer.address)).to.equal(true);
    });

    it("Should check All White Listed Address", async () => {
      const { vesting, deployer } = await loadFixture(basicMethod);

      expect(await vesting.getAllWhiteListed()).to.deep.members([
        deployer.address,
      ]);
    });

    it("Should check Claimed Months", async () => {
      const { vesting } = await loadFixture(basicMethod);

      expect(await vesting.claimedMonth(0)).to.equal(12);
      expect(await vesting.claimedMonth(1)).to.equal(6);
      expect(await vesting.claimedMonth(2)).to.equal(1);
      expect(await vesting.claimedMonth(3)).to.equal(6);
      expect(await vesting.claimedMonth(4)).to.equal(12);
      expect(await vesting.claimedMonth(5)).to.equal(0);
      expect(await vesting.claimedMonth(6)).to.equal(0);
      expect(await vesting.claimedMonth(7)).to.equal(1);
      expect(await vesting.claimedMonth(8)).to.equal(1);
      expect(await vesting.claimedMonth(9)).to.equal(8);
      expect(await vesting.claimedMonth(10)).to.equal(0);
    });

    describe("Revert Condition for Constructor", () => {
      it("Should check Fee Token Address Invalid", async () => {
        const { deployer, category } = await loadFixture(basicMethod);

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

      it("Should check MPC Address Invalid", async () => {
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

      it("Should check Beneficiary Address Invalid", async () => {
        const { deployer, token } = await loadFixture(basicMethod);

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
        ];

        // Deploy Vesting Contract
        const Vesting = await ethers.getContractFactory("Vesting");

        await expect(
          Vesting.deploy(token.address, [deployer.address], category),
        ).to.be.revertedWith("Vesting: Invalid beneficiary address!");
      });

      it("Should check Total Tokens Quantity Invalid", async () => {
        const { deployer, token, admins } = await loadFixture(basicMethod);

        var category = [
          {
            categoryName: "Team",
            lockedPeriod: 12,
            vestingPeriod: 24,
            totalTokens: decimal(2500000000),
            genesisAmount: decimal(0),
            releasedToken: decimal(2500000000),
            avgReleasedToken: decimal(2500000000).div(24),
            totalRemainingTokens: decimal(2500000000),
            beneficiary: admins[0].address,
          },

          {
            categoryName: "Advisors",
            lockedPeriod: 12,
            vestingPeriod: 24,
            totalTokens: decimal(2500000000),
            genesisAmount: decimal(100000),
            releasedToken: decimal(2500000000),
            avgReleasedToken: decimal(2500000000).div(24),
            totalRemainingTokens: decimal(2500000000),
            beneficiary: admins[0].address,
          },
        ];

        // Deploy Vesting Contract
        const Vesting = await ethers.getContractFactory("Vesting");

        await expect(
          Vesting.deploy(token.address, [deployer.address], category),
        ).to.be.revertedWith("Vesting: Total tokens exceeds max supply!");
      });
    });
  });

  describe("Update Beneficiary Address", () => {
    it("Should check to Update beneficiary address", async () => {
      const { admins, vesting } = await loadFixture(basicMethod);
      await vesting.updateBeneficiary(7, admins[12].address);

      expect(await vesting.categories(7)).to.deep.members([
        "Airdrop Rewards",
        big(1),
        big(12),
        decimal(150000000),
        decimal(75000000),
        decimal(75000000),
        decimal(75000000).div(12),
        decimal(150000000),
        admins[12].address,
      ]);
    });

    it("Should check Event for Update beneficiary address", async () => {
      const { deployer, admins, vesting } = await loadFixture(basicMethod);

      expect(vesting.connect(deployer).updateBeneficiary(7, admins[12].address))
        .to.emit(vesting, "UpdateBeneficiary")
        .withArgs(7, admins[12].address, deployer.address, await time.latest());
    });

    describe("Revert Condition for Update Beneficiary Address", () => {
      it("Should check to Update beneficiary address", async () => {
        const { admins, vesting } = await loadFixture(basicMethod);

        await expect(
          vesting.connect(admins[0]).updateBeneficiary(7, admins[12].address),
        ).to.revertedWith(
          "Vesting: Only Whitelisted Address can perform this action!",
        );
      });

      it("Should check to Update beneficiary address", async () => {
        const { deployer, vesting } = await loadFixture(basicMethod);

        await expect(
          vesting
            .connect(deployer)
            .updateBeneficiary(7, "0x0000000000000000000000000000000000000000"),
        ).to.revertedWith("Vesting: Invalid beneficiary address!");
      });
    });
  });

  describe("Start Distribution", () => {
    it("Should check to Start Distribution", async () => {
      const { deployer, admins, vesting } = await loadFixture(basicMethod);

      await vesting.connect(deployer).start();

      expect(await vesting.categories(3)).to.deep.members([
        "Private Sale",
        big(6),
        big(16),
        decimal(150000000),
        decimal(22500000),
        decimal(127500000),
        decimal(127500000).div(16),
        decimal(150000000).sub(decimal(22500000)),
        admins[3].address,
      ]);

      expect(await vesting.categories(4)).to.deep.members([
        "Seed Sale",
        big(12),
        big(16),
        decimal(450000000),
        decimal(18000000),
        decimal(432000000),
        decimal(432000000).div(16),
        decimal(450000000).sub(decimal(18000000)),
        admins[4].address,
      ]);

      expect(await vesting.categories(5)).to.deep.members([
        "Public Launch",
        big(0),
        big(3),
        decimal(125000000),
        decimal(62500000),
        decimal(62500000),
        decimal(62500000).div(3),
        decimal(125000000).sub(decimal(62500000)),
        admins[5].address,
      ]);

      expect(await vesting.categories(6)).to.deep.members([
        "Exchanges (Liquidity)",
        big(0),
        big(3),
        decimal(175000000),
        decimal(70000000),
        decimal(105000000),
        decimal(105000000).div(3),
        decimal(175000000).sub(decimal(70000000)),
        admins[6].address,
      ]);

      expect(await vesting.categories(7)).to.deep.members([
        "Airdrop Rewards",
        big(1),
        big(12),
        decimal(150000000),
        decimal(75000000),
        decimal(75000000),
        decimal(75000000).div(12),
        decimal(150000000).sub(decimal(75000000)),
        admins[7].address,
      ]);

      expect(await vesting.categories(10)).to.deep.members([
        "Reserve Fund",
        big(0),
        big(6),
        decimal(600000000),
        decimal(120000000),
        decimal(480000000),
        decimal(480000000).div(6),
        decimal(600000000).sub(decimal(120000000)),
        admins[10].address,
      ]);
    });

    it("Should check to Token Holders", async () => {
      const { deployer, admins, vesting } = await loadFixture(basicMethod);

      await vesting.connect(deployer).start();

      let tokenHolders0 = await vesting.tokenHolders(0);
      expect(tokenHolders0).to.deep.members([
        big(3),
        admins[3].address,
        decimal(22500000),
        big(tokenHolders0.time),
      ]);

      let tokenHolders1 = await vesting.tokenHolders(1);
      expect(tokenHolders1).to.deep.members([
        big(4),
        admins[4].address,
        decimal(18000000),
        big(tokenHolders1.time),
      ]);

      let tokenHolders2 = await vesting.tokenHolders(2);
      expect(tokenHolders2).to.deep.members([
        big(5),
        admins[5].address,
        decimal(62500000),
        big(tokenHolders2.time),
      ]);

      let tokenHolders3 = await vesting.tokenHolders(3);
      expect(tokenHolders3).to.deep.members([
        big(6),
        admins[6].address,
        decimal(70000000),
        big(tokenHolders3.time),
      ]);

      let tokenHolders4 = await vesting.tokenHolders(4);
      expect(tokenHolders4).to.deep.members([
        big(7),
        admins[7].address,
        decimal(75000000),
        big(tokenHolders4.time),
      ]);

      let tokenHolders5 = await vesting.tokenHolders(5);
      expect(tokenHolders5).to.deep.members([
        big(10),
        admins[10].address,
        decimal(120000000),
        big(tokenHolders5.time),
      ]);
    });

    it("Should check to All Token Holders", async () => {
      const { deployer, admins, vesting } = await loadFixture(basicMethod);

      await vesting.connect(deployer).start();

      let tokenHolders0 = await vesting.tokenHolders(0);
      let tokenHolders1 = await vesting.tokenHolders(1);
      let tokenHolders2 = await vesting.tokenHolders(2);
      let tokenHolders3 = await vesting.tokenHolders(3);
      let tokenHolders4 = await vesting.tokenHolders(4);
      let tokenHolders5 = await vesting.tokenHolders(5);

      expect(await vesting.allusers()).to.deep.members([
        [big(3), admins[3].address, decimal(22500000), big(tokenHolders0.time)],
        [big(4), admins[4].address, decimal(18000000), big(tokenHolders1.time)],
        [big(5), admins[5].address, decimal(62500000), big(tokenHolders2.time)],
        [big(6), admins[6].address, decimal(70000000), big(tokenHolders3.time)],
        [big(7), admins[7].address, decimal(75000000), big(tokenHolders4.time)],
        [
          big(10),
          admins[10].address,
          decimal(120000000),
          big(tokenHolders5.time),
        ],
      ]);
    });

    it("Should check Token Holders Balances", async () => {
      const { deployer, admins, token, vesting } = await loadFixture(
        basicMethod,
      );

      await vesting.connect(deployer).start();

      expect(await token.balanceOf(admins[3].address)).to.equal(
        decimal(22500000),
      );
      expect(await token.balanceOf(admins[4].address)).to.equal(
        decimal(18000000),
      );
      expect(await token.balanceOf(admins[5].address)).to.equal(
        decimal(62500000),
      );
      expect(await token.balanceOf(admins[6].address)).to.equal(
        decimal(70000000),
      );
      expect(await token.balanceOf(admins[7].address)).to.equal(
        decimal(75000000),
      );
      expect(await token.balanceOf(admins[10].address)).to.equal(
        decimal(120000000),
      );
    });

    it("Should check Event for Start Distribution", async () => {
      const { deployer, admins, vesting } = await loadFixture(basicMethod);

      let event = vesting.connect(deployer).start();

      await expect(event)
        .to.emit(vesting, "TokenTransfer")
        .withArgs(deployer.address, admins[3].address, decimal(22500000));
      await expect(event)
        .to.emit(vesting, "TokenTransfer")
        .withArgs(deployer.address, admins[4].address, decimal(18000000));
      await expect(event)
        .to.emit(vesting, "TokenTransfer")
        .withArgs(deployer.address, admins[5].address, decimal(62500000));
      await expect(event)
        .to.emit(vesting, "TokenTransfer")
        .withArgs(deployer.address, admins[6].address, decimal(70000000));
      await expect(event)
        .to.emit(vesting, "TokenTransfer")
        .withArgs(deployer.address, admins[7].address, decimal(75000000));
      await expect(event)
        .to.emit(vesting, "TokenTransfer")
        .withArgs(deployer.address, admins[10].address, decimal(120000000));
    });

    describe("Revert Condition for Start Distribution", () => {
      it("Should check to Start Distribution", async () => {
        const { admins, vesting } = await loadFixture(basicMethod);

        await expect(vesting.connect(admins[0]).start()).to.revertedWith(
          "Vesting: Only Whitelisted Address can perform this action!",
        );
      });

      it("Should check to Start Distribution", async () => {
        const { deployer, vesting } = await loadFixture(basicMethod);

        await vesting.connect(deployer).start();

        await expect(vesting.connect(deployer).start()).to.revertedWith(
          "Vesting: Tokenization already Started!",
        );
      });
    });
  });

  describe("Released Single Category Token", () => {
    it("Should check to Released Token for Incentive Rewards", async () => {
      const { deployer, admins, vesting, category } = await loadFixture(
        basicMethod,
      );

      await vesting.connect(deployer).start();

      let totalReleasedTokens = big(0);

      for (let i = 0; i < 60; i++) {
        await time.increaseTo(forSecond(2592000 * i));
        await vesting.releasedCategoryToken(8);

        let locked = category[8].lockedPeriod;
        let vestingPeriod = locked + category[8].vestingPeriod;

        if (i > locked && i < vestingPeriod) {
          totalReleasedTokens = totalReleasedTokens.add(
            category[8].avgReleasedToken,
          );

          expect(await vesting.categories(8)).to.deep.members([
            "Incentive Rewards",
            big(1),
            big(48),
            decimal(1100000000),
            decimal(0),
            decimal(1100000000),
            decimal(1100000000).div(48),
            decimal(1100000000).sub(totalReleasedTokens),
            admins[8].address,
          ]);
        } else if (i > vestingPeriod) {
          expect(await vesting.categories(8)).to.deep.members([
            "Incentive Rewards",
            big(1),
            big(48),
            decimal(1100000000),
            decimal(0),
            decimal(1100000000),
            decimal(1100000000).div(48),
            decimal(0),
            admins[8].address,
          ]);
        }
      }
    });

    it("Should check to Incentive Rewards Token Holders Balances", async () => {
      const { deployer, admins, token, vesting, category } = await loadFixture(
        basicMethod,
      );

      await vesting.connect(deployer).start();

      let totalReleasedTokens = big(0);

      for (let i = 0; i < 60; i++) {
        await time.increaseTo(forSecond(2592000 * i));
        await vesting.releasedCategoryToken(8);

        let locked = category[8].lockedPeriod;
        let vestingPeriod = locked + category[8].vestingPeriod;

        if (i > locked && i < vestingPeriod) {
          totalReleasedTokens = totalReleasedTokens.add(
            category[8].avgReleasedToken,
          );

          expect(await token.balanceOf(admins[8].address)).to.equal(
            totalReleasedTokens,
          );
        } else if (i > vestingPeriod) {
          expect(await token.balanceOf(admins[8].address)).to.equal(
            category[8].totalTokens,
          );
        }
      }
    });

    it("Should check to Start Distribution or not", async () => {
      const { vesting } = await loadFixture(basicMethod);

      await expect(vesting.releasedCategoryToken(8)).to.revertedWith(
        "Vesting: Distribution not started yet!",
      );
    });
  });

  describe("Released Category Token", () => {
    it("Should check to Released Token for Incentive Rewards", async () => {
      const { deployer, admins, vesting, category } = await loadFixture(
        basicMethod,
      );

      await vesting.connect(deployer).start();

      let totalReleasedTokens = big(0);

      for (let i = 0; i < 60; i++) {
        await time.increaseTo(forSecond(2592000 * i));
        await vesting.released();

        let locked = category[8].lockedPeriod;
        let vestingPeriod = locked + category[8].vestingPeriod;

        if (i > locked && i < vestingPeriod) {
          totalReleasedTokens = totalReleasedTokens.add(
            category[8].avgReleasedToken,
          );

          expect(await vesting.categories(8)).to.deep.members([
            "Incentive Rewards",
            big(1),
            big(48),
            decimal(1100000000),
            decimal(0),
            decimal(1100000000),
            decimal(1100000000).div(48),
            decimal(1100000000).sub(totalReleasedTokens),
            admins[8].address,
          ]);
        } else if (i > vestingPeriod) {
          expect(await vesting.categories(8)).to.deep.members([
            "Incentive Rewards",
            big(1),
            big(48),
            decimal(1100000000),
            decimal(0),
            decimal(1100000000),
            decimal(1100000000).div(48),
            decimal(0),
            admins[8].address,
          ]);
        }
      }
    });

    it("Should check to Incentive Rewards Token Holders Balances", async () => {
      const { deployer, admins, token, vesting, category } = await loadFixture(
        basicMethod,
      );

      await vesting.connect(deployer).start();

      let totalReleasedTokens = big(0);

      for (let i = 0; i < 60; i++) {
        await time.increaseTo(forSecond(2592000 * i));
        await vesting.released();

        let locked = category[8].lockedPeriod;
        let vestingPeriod = locked + category[8].vestingPeriod;

        if (i > locked && i < vestingPeriod) {
          totalReleasedTokens = totalReleasedTokens.add(
            category[8].avgReleasedToken,
          );

          expect(await token.balanceOf(admins[8].address)).to.equal(
            totalReleasedTokens,
          );
        } else if (i > vestingPeriod) {
          expect(await token.balanceOf(admins[8].address)).to.equal(
            category[8].totalTokens,
          );
        }
      }
    });

    it("Should check to Start Distribution or not", async () => {
      const { vesting } = await loadFixture(basicMethod);

      await expect(vesting.released()).to.revertedWith(
        "Vesting: Distribution not started yet!",
      );
    });
  });
});
