/** @format */

import { Web3 } from "web3";

import BlueToken_ABI from "../ABI/BlueToken_ABI.json";
import Vesting_ABI from "../ABI/Vesting_ABI.json";

export const Web3Index = async () => {
  return new Promise(async (resolve, reject) => {
    const web3 = new Web3(window.ethereum);

    const chainId = await (await web3.eth.getChainId()).toString();

    if (chainId !== process.env.REACT_APP_ChainId) {
      var modal = document.getElementById("myModal");
      modal.style.display = "block";
    } else {
      try {
        if (!localStorage.getItem("connectedAddress")) {
          window.ethereum.request({ method: "eth_requestAccounts" });
        }

        resolve(web3);
      } catch (error) {
        reject(error);
      }
    }
  });
};

export const ContractInstance = async () => {
  const web3 = await Web3Index();

  let blueTokenInstance = new web3.eth.Contract(
    BlueToken_ABI,
    process.env.REACT_APP_BLUE_TOKEN,
  );
  let vestingInstance = new web3.eth.Contract(
    Vesting_ABI,
    process.env.REACT_APP_VESTING,
  );
  return { blueTokenInstance, vestingInstance };
};
