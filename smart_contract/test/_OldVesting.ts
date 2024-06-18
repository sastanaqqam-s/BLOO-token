/** @format */

// /** @format */

// import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
// import { exit } from "process";

// import { basicMethod, decimal, forSecond } from "./index";

// describe("Basic Contract", () => {
//   it("Should check Message ", async () => {
//     const { deployer, token, vesting } = await loadFixture(basicMethod);

//     await vesting.start();

//     console.log("startAt--->> ", await vesting.startAt());

//     console.log(
//       "totalUnlockedTokens--->> ",
//       await vesting.totalUnlockedTokens(),
//       "\t totalCompletedMonths--->> ",
//       await vesting.totalCompletedMonths(),
//       "\t\t totalRemainingTokens--->> ",
//       await vesting.totalRemainingTokens(),
//     );

//     {
//       // change forSecond(60 to days(30
//       for (let i = 0; i <= 60; i++) {
//         // console.log(12 + i, 31250000 * i);

//         // await time.increaseTo(forSecond(60 * i));
//         await time.increaseTo(forSecond(60 * i));
//         await vesting.transferToken(deployer.address, decimal(10000000));

//         console.log(
//           i,
//           " ",
//           await vesting.totalUnlockedTokens(),
//           "\t",
//           await vesting.totalCompletedMonths(),
//           "\t",
//           await vesting.totalRemainingTokens(),
//         );

//         console.log(
//           "-------------------------------------------------------------------------------- \n\n",
//         );
//       }
//     }

//     // {
//     //   console.log(
//     //     "-------------------------------------------------------------------------------- \n\n",
//     //   );
//     //   console.log(
//     //     "\t\t totalRemainingTokens--->> ",
//     //     await vesting.totalRemainingTokens(),
//     //   );

//     //   await time.increaseTo(forSecond(60 * 0));
//     //   await vesting.transferToken(
//     //     deployer.address,
//     //     await vesting.totalRemainingTokens(),
//     //   );
//     //   console.log(
//     //     "0--->> ",
//     //     "totalUnlockedTokens--->> ",
//     //     await vesting.totalUnlockedTokens(),
//     //     "\t totalCompletedMonths--->> ",
//     //     await vesting.totalCompletedMonths(),
//     //     "\t\t totalRemainingTokens--->> ",
//     //     await vesting.totalRemainingTokens(),
//     //   );

//     //   console.log(
//     //     "-------------------------------------------------------------------------------- \n\n",
//     //   );
//     //   console.log(
//     //     "\t\t totalRemainingTokens--->> ",
//     //     await vesting.totalRemainingTokens(),
//     //   );
//     //   await time.increaseTo(forSecond(60 * 15));
//     //   await vesting.transferToken(
//     //     deployer.address,
//     //     await vesting.totalRemainingTokens(),
//     //   );
//     //   console.log(
//     //     "15--->> ",
//     //     "totalUnlockedTokens--->> ",
//     //     await vesting.totalUnlockedTokens(),
//     //     "\t totalCompletedMonths--->> ",
//     //     await vesting.totalCompletedMonths(),
//     //     "\t\t totalRemainingTokens--->> ",
//     //     await vesting.totalRemainingTokens(),
//     //   );

//     //   console.log(
//     //     "-------------------------------------------------------------------------------- \n\n",
//     //   );
//     //   console.log(
//     //     "\t\t totalRemainingTokens--->> ",
//     //     await vesting.totalRemainingTokens(),
//     //   );
//     //   await time.increaseTo(forSecond(60 * 20));
//     //   await vesting.transferToken(
//     //     deployer.address,
//     //     await vesting.totalRemainingTokens(),
//     //   );
//     //   console.log(
//     //     "20--->> ",
//     //     "totalUnlockedTokens--->> ",
//     //     await vesting.totalUnlockedTokens(),
//     //     "\t\t totalCompletedMonths--->> ",
//     //     await vesting.totalCompletedMonths(),
//     //     "\t\t totalRemainingTokens--->> ",
//     //     await vesting.totalRemainingTokens(),
//     //   );

//     //   console.log(
//     //     "-------------------------------------------------------------------------------- \n\n",
//     //   );
//     //   console.log(
//     //     "\t\t totalRemainingTokens--->> ",
//     //     await vesting.totalRemainingTokens(),
//     //   );
//     //   await time.increaseTo(forSecond(60 * 30));
//     //   await vesting.transferToken(
//     //     deployer.address,
//     //     await vesting.totalRemainingTokens(),
//     //   );
//     //   console.log(
//     //     "30--->> ",
//     //     "totalUnlockedTokens--->> ",
//     //     await vesting.totalUnlockedTokens(),
//     //     "\t\t totalCompletedMonths--->> ",
//     //     await vesting.totalCompletedMonths(),
//     //     "\t\t totalRemainingTokens--->> ",
//     //     await vesting.totalRemainingTokens(),
//     //   );

//     //   console.log(
//     //     "-------------------------------------------------------------------------------- \n\n",
//     //   );
//     //   console.log(
//     //     "\t\t totalRemainingTokens--->> ",
//     //     await vesting.totalRemainingTokens(),
//     //   );
//     //   await time.increaseTo(forSecond(60 * 36));
//     //   await vesting.transferToken(
//     //     deployer.address,
//     //     await vesting.totalRemainingTokens(),
//     //   );
//     //   console.log(
//     //     "36--->> ",
//     //     "totalUnlockedTokens--->> ",
//     //     await vesting.totalUnlockedTokens(),
//     //     "\t\t totalCompletedMonths--->> ",
//     //     await vesting.totalCompletedMonths(),
//     //     "\t\t totalRemainingTokens--->> ",
//     //     await vesting.totalRemainingTokens(),
//     //   );

//     //   console.log(
//     //     "-------------------------------------------------------------------------------- \n\n",
//     //   );
//     //   console.log(
//     //     "\t\t totalRemainingTokens--->> ",
//     //     await vesting.totalRemainingTokens(),
//     //   );
//     //   await time.increaseTo(forSecond(60 * 45));
//     //   await vesting.transferToken(
//     //     deployer.address,
//     //     await vesting.totalRemainingTokens(),
//     //   );
//     //   console.log(
//     //     "45--->> ",
//     //     "totalUnlockedTokens--->> ",
//     //     await vesting.totalUnlockedTokens(),
//     //     "\t\t totalCompletedMonths--->> ",
//     //     await vesting.totalCompletedMonths(),
//     //     "\t\t totalRemainingTokens--->> ",
//     //     await vesting.totalRemainingTokens(),
//     //   );

//     //   console.log(
//     //     "-------------------------------------------------------------------------------- \n\n",
//     //   );
//     //   console.log(
//     //     "\t\t totalRemainingTokens--->> ",
//     //     await vesting.totalRemainingTokens(),
//     //   );
//     //   await time.increaseTo(forSecond(60 * 50));
//     //   await vesting.transferToken(
//     //     deployer.address,
//     //     await vesting.totalRemainingTokens(),
//     //   );
//     //   console.log(
//     //     "50--->> ",
//     //     "totalUnlockedTokens--->> ",
//     //     await vesting.totalUnlockedTokens(),
//     //     "\t\t totalCompletedMonths--->> ",
//     //     await vesting.totalCompletedMonths(),
//     //     "\t\t totalRemainingTokens--->> ",
//     //     await vesting.totalRemainingTokens(),
//     //   );
//     // }

//     exit();
//   });
// });
