/** @format */

import { useEffect } from "react";

import swal from "sweetalert";

import { Web3 } from "web3";
import { Web3Index } from "./web3Index";

export const WalletConnection = () => {
  useEffect(() => {
    Web3Index();
  }, []);

  window.addEventListener("load", async () => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", async function (accounts) {
        localStorage.removeItem("connectedAddress");
        if (accounts.length > 0) {
          swal("Success!", "Wallet Connected Successfully!", "success");
          localStorage.setItem("connectedAddress", accounts[0]);
          window.location.reload();
        } else {
          await disconnectWallet();
        }
      });
    } else {
      /* MetaMask is not installed */
      localStorage.removeItem("connectedAddress");
      swal("Alert!", "Please install MetaMask!", "warning");
    }
  });

  const connectWallet = async () => {
    await setLocalStorage();
    swal("Success!", "Wallet Connected Successfully!", "success");
  };

  const disconnectWallet = async () => {
    localStorage.removeItem("connectedAddress");
    swal("Success!", "Wallet Disconnected Sucessfully!", "success");
  };

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: Web3.utils.toHex(parseInt(process.env.REACT_APP_ChainId)),
          },
        ],
      });
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: Web3.utils.toHex(
                  parseInt(process.env.REACT_APP_ChainId),
                ),
                rpcUrls: [process.env.REACT_APP_ALCHEMY_POLYGON_API_KEY],
                chainName: process.env.REACT_APP_ALCHEMY_POLYGON_NAME,
                nativeCurrency: {
                  name: process.env.REACT_APP_ALCHEMY_POLYGON_NAME,
                  symbol: process.env.REACT_APP_ALCHEMY_POLYGON_SYMBOL, // 2-6 characters long
                  decimals: 18,
                },
                blockExplorerUrls: [
                  process.env.REACT_APP_ALCHEMY_POLYGON_SITE_URL,
                ],
              },
            ],
          });

          // var modal = document.getElementById("myModal");
          // modal.style.display = "none";
        } catch (addError) {
          swal("Error!", "Something went wrong, Network not Added!", "error");
          console.error(addError);
        }
      }
      console.error(error);
    }
  };

  const getWalletAddress = async () => {
    const web3 = new Web3(window.ethereum);
    let walletAddress = await web3.eth.requestAccounts();
    if (walletAddress) {
      localStorage.setItem("connectedAddress", walletAddress[0]);
      return true;
    } else {
      return false;
    }
  };

  async function setLocalStorage() {
    /* 
      get connected wallet address
    */
    let address = localStorage.getItem("connectedAddress");
    if (!address) {
      let refreshAddress = await getWalletAddress();
      if (refreshAddress) {
        address = localStorage.getItem("connectedAddress");
      }
    }
  }

  return {
    switchNetwork: switchNetwork,
    connectWallet: connectWallet,
    disconnectWallet: disconnectWallet,
  };
};
