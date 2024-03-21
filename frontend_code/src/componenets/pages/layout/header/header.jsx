/** @format */
import $ from "jquery";
import React, { useEffect, useState } from "react";

import { faBars } from "@fortawesome/fontawesome-free-solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import WalletIcon from "@mui/icons-material/Wallet";
import Tooltip from "@mui/material/Tooltip";
import { Link, useNavigate } from "react-router-dom";

// import wallet connection.jsx in the smart contract folder
import { WalletConnection } from "../../../smart_contract/Web3/walletConnection";

// import swal from "sweetalert";

export const Header = (props) => {
  const heading = props.heading;

  const connection = WalletConnection();
  const navigateTo = useNavigate();

  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    let address = localStorage.getItem("connectedAddress");
    if (address) {
      setWalletAddress(address);
    } else {
      setWalletAddress(null);
    }
  }, [connection]);

  window.addEventListener("load", async () => {
    window.ethereum.on("accountsChanged", async function (accounts) {
      if (accounts.length == 0) {
        await disconnectWallet();
      }
    });
  });

  const switchNetwork = async () => {
    await connection.switchNetwork();
  };

  const connectWallet = async () => {
    await connection.connectWallet();
    let address = localStorage.getItem("connectedAddress");
    setWalletAddress(address);

    navigateTo("/tokenomics/");
  };

  const disconnectWallet = async () => {
    await connection.disconnectWallet();
    setWalletAddress(null);
  };

  const dashboardCompact = () => {
    const mobileScreen = window.matchMedia("(max-width: 990px )");
    if (mobileScreen.matches) {
      $(".dashboard-nav").toggleClass("mobile-show");
    } else {
      $("#dashboard").toggleClass("dashboard-compact");
    }
  };

  return (
    <>
      <div id='myModal' className='modal '>
        <div className='modal-content my-4'>
          <div className='text-center'>
            <div className='spinner-border' role='status'></div>
          </div>

          <h5 className='fw-bold my-4'>Wrong network connection detected</h5>

          <p className='fw-medium mb-8'>
            Looks like your current network selection is not supported. Please{" "}
            <span className='fw-semibold'>
              <Link onClick={switchNetwork}>
                switch to the Polygon blockchain network
              </Link>{" "}
              in your wallet to continue,
            </span>
            or sign out.
          </p>
        </div>
      </div>
      <header className='dashboard-toolbar'>
        <Link href='#' className='menu-toggle' onClick={dashboardCompact}>
          <FontAwesomeIcon icon={faBars} />
        </Link>
        <div className='heading'>
          {" "}
          <h2> {heading}</h2>
        </div>
      </header>

      {/* Connect Wallet Button */}
      <header className='connect-wallet justify-content-end'>
        <Tooltip
          title={
            walletAddress ? (
              <h6>{walletAddress}</h6>
            ) : (
              <h6>Click Connect Wallet button to Connect with Metamask</h6>
            )
          }
          arrow>
          {walletAddress ? (
            <button className='walletConnected' variant='success'>
              <WalletIcon className='walletIcon' /> <b>Connected Wallet:</b>
              <select onChange={disconnectWallet} className=' dropdown-toggle'>
                <option>
                  {walletAddress.substring(0, 7)}......
                  {walletAddress.substring(36)}
                </option>
                <option className='btn btn-danger'>Disconnect</option>
              </select>
            </button>
          ) : (
            <button className='walletButton' onClick={connectWallet}>
              <WalletIcon className='walletIcon' />
              <span className='is-link has-text-weight-bold'>
                Connect Wallet
              </span>
            </button>
          )}
        </Tooltip>
      </header>

      {/* <Mobileheader /> */}
    </>
  );
};
