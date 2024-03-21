/** @format */

import { ContractInstance } from "./web3Index";

// import swal from "sweetalert";

export const ContractMethods = () => {
  function decimal(value) {
    if (Number(value) >= 1e18) {
      return Math.trunc(Number(value) / 1e18);
    } else {
      return Number(value);
    }
  }

  const whiteListed = async (account) => {
    const { vestingInstance } = await ContractInstance();
    let status = await vestingInstance.methods
      .whiteListed(account)
      .call()
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log("whiteListed error->>>>>>>>>>>", err);
      });

    return status;
  };

  const getCategory = async (id) => {
    const { vestingInstance } = await ContractInstance();

    let categoryDetail = await vestingInstance.methods
      .categories(id)
      .call()
      .then((result) => {
        let newResult = {
          categoryName: String(result.categoryName),
          lockedPeriod: decimal(result.lockedPeriod),
          vestingPeriod: decimal(result.vestingPeriod),
          percentageHold: decimal(result.percentageHold),
          totalTokens: decimal(result.totalTokens),
          genesisPercentage: decimal(result.genesisPercentage),
          genesisAmount: decimal(result.genesisAmount),
          releasedToken: decimal(result.releasedToken),
          avgReleasedToken: decimal(result.avgReleasedToken),
          remainReleasedToken: decimal(result.remainReleasedToken),
        };

        return newResult;
      })
      .catch((err) => {
        console.log("getCategory->>>>>>>>>>>", err);
        return {
          status: false,
          message: "View Category Details method Error !",
        };
      });

    return categoryDetail;
  };

  const viewAllCategory = async () => {
    const { vestingInstance } = await ContractInstance();

    let categoryDetail = await vestingInstance.methods
      .getCategoryDetail()
      .call()
      .then((result) => {
        let newResult = result.map(
          ({
            categoryName,
            lockedPeriod,
            vestingPeriod,
            percentageHold,
            totalTokens,
            genesisPercentage,
            genesisAmount,
            releasedToken,
            avgReleasedToken,
            remainReleasedToken,
          }) => {
            return {
              categoryName: String(categoryName),
              lockedPeriod: decimal(lockedPeriod),
              vestingPeriod: decimal(vestingPeriod),
              percentageHold: decimal(percentageHold),
              totalTokens: decimal(totalTokens),
              genesisPercentage: decimal(genesisPercentage),
              genesisAmount: decimal(genesisAmount),
              releasedToken: decimal(releasedToken),
              avgReleasedToken: decimal(avgReleasedToken),
              remainReleasedToken: decimal(remainReleasedToken),
            };
          },
        );

        return newResult;
      })
      .catch((err) => {
        console.log("Create Task->>>>>>>>>>>", err);
        return {
          status: false,
          message: "View Category Details method Error !",
        };
      });

    return categoryDetail;
  };

  const startAt = async () => {
    const { vestingInstance } = await ContractInstance();
    let startAt = await vestingInstance.methods
      .startAt()
      .call()
      .then((result) => {
        return decimal(result);
      })
      .catch((err) => {
        console.log("startAt error->>>>>>>>>>>", err);
      });

    return startAt;
  };

  const totalUnlockedTokens = async () => {
    const { vestingInstance } = await ContractInstance();

    let totalUnlockedTokens = await vestingInstance.methods
      .totalUnlockedTokens()
      .call()
      .then((result) => {
        return decimal(result);
      })
      .catch((err) => {
        console.log("totalUnlockedTokens error->>>>>>>>>>>", err);
      });

    return totalUnlockedTokens;
  };

  const totalRemainingTokens = async () => {
    const { vestingInstance } = await ContractInstance();

    let totalRemainingTokens = await vestingInstance.methods
      .totalRemainingTokens()
      .call()
      .then((result) => {
        return decimal(result);
      })
      .catch((err) => {
        console.log("totalRemainingTokens error->>>>>>>>>>>", err);
      });

    return totalRemainingTokens;
  };

  const getBalance = async (account) => {
    const { blueTokenInstance } = await ContractInstance();
    let balanceOf = await blueTokenInstance.methods
      .balanceOf(account)
      .call()
      .then((result) => {
        return decimal(result);
      })
      .catch((err) => {
        console.log("balanceOf error->>>>>>>>>>>", err);
      });

    return balanceOf;
  };

  const maxSupply = async (account) => {
    const { blueTokenInstance } = await ContractInstance();
    let max_supply = await blueTokenInstance.methods
      .max_supply()
      .call()
      .then((result) => {
        return decimal(result);
      })
      .catch((err) => {
        console.log("max_supply error->>>>>>>>>>>", err);
      });

    return max_supply;
  };

  const allUsers = async () => {
    const { vestingInstance } = await ContractInstance();
    let allusers = await vestingInstance.methods
      .allusers()
      .call()
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log("allusers error->>>>>>>>>>>", err);
      });

    return allusers;
  };

  const getTransactionHistory = async (allusers) => {
    let newUserArray = [];
    for (let i = 0; i < allusers.length; i++) {
      newUserArray.push({
        id: i + 1,
        users: allusers[i].users,
        tokens: decimal(allusers[i].tokens),
        time: new Date(Number(allusers[i].time) * 1000).toLocaleString("en-US"),
      });
    }

    const data = {
      columns: [
        {
          label: "S.No.",
          field: "id",
          sort: "asc",
          width: 150,
        },
        {
          label: "Wallet Address",
          field: "users",
          sort: "asc",
          width: 200,
        },
        {
          label: "Tokens",
          field: "tokens",
          sort: "asc",
          width: 200,
        },
        {
          label: "Date",
          field: "time",
          sort: "asc",
          width: 100,
        },
      ],
      rows: newUserArray,
    };

    return data;
  };

  const startDistribution = async () => {
    const walletAddress = localStorage.getItem("connectedAddress");

    if (!walletAddress) {
      return false;
    }

    const { vestingInstance } = await ContractInstance();

    let startDistribution = vestingInstance.methods
      .start()
      .send({ from: walletAddress })
      .then((result) => {
        return true;
      })
      .catch((err) => {
        console.log("startDistribution error->>>>>>>>>>>", err);
        return false;
      });

    return startDistribution;
  };

  const mulipleTransferTokens = async (userAddress, token) => {
    const walletAddress = localStorage.getItem("connectedAddress");

    if (!walletAddress) {
      return false;
    }

    const { vestingInstance } = await ContractInstance();

    let transferToken = vestingInstance.methods
      .multiTransferToken(userAddress, token)
      .send({ from: walletAddress })
      .then((result) => {
        return true;
      })
      .catch((err) => {
        console.log("mulipleTransferTokens error->>>>>>>>>>>", err);
        return false;
      });

    return transferToken;
  };

  const transferTokens = async (userAddress, token) => {
    const walletAddress = localStorage.getItem("connectedAddress");

    if (!walletAddress) {
      return false;
    }

    const { vestingInstance } = await ContractInstance();

    let transferToken = vestingInstance.methods
      .transferToken(userAddress, token)
      .send({ from: walletAddress })
      .then((result) => {
        return true;
      })
      .catch((err) => {
        console.log("transferTokens error->>>>>>>>>>>", err);
        return false;
      });

    return transferToken;
  };

  return {
    // read method
    whiteListed: whiteListed,
    getCategory: getCategory,
    viewAllCategory: viewAllCategory,
    startAt: startAt,
    totalUnlockedTokens: totalUnlockedTokens,
    allUsers: allUsers,
    getTransactionHistory: getTransactionHistory,
    getBalance: getBalance,
    maxSupply: maxSupply,
    totalRemainingTokens: totalRemainingTokens,

    // write method
    startDistribution: startDistribution,
    mulipleTransferTokens: mulipleTransferTokens,
    transferTokens: transferTokens,
  };
};
