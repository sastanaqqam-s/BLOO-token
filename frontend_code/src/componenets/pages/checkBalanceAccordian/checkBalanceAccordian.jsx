/** @format */

import React, { useState } from "react";

import { Web3 } from "web3";

import Accordion from "react-bootstrap/Accordion";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import Form from "react-bootstrap/Form";

import { ContractMethods } from "../../smart_contract/Web3/contractMethods";

export const CheckBalanceAccordian = () => {
  const contract = ContractMethods();

  const [checkbalance, setCheckBalance] = useState(0);

  const checkBalance = async () => {
    let userAddress = document.getElementById("checkUserAddress").value;
    userAddress = userAddress.trim();

    if (!userAddress) {
      document.getElementById("checkAddressError").innerHTML =
        "Wallet Address is required!";
      document.getElementById("checkUserAddress").classList.add("is-invalid");
    } else if (!Web3.utils.isAddress(userAddress)) {
      document.getElementById("checkAddressError").innerHTML =
        "Wallet Address is Invalid!";
      document.getElementById("checkUserAddress").classList.add("is-invalid");
    } else {
      document.getElementById("checkAddressError").innerHTML = "";
      document
        .getElementById("checkUserAddress")
        .classList.remove("is-invalid");

      var getWalletBalance = await contract.getBalance(userAddress);

      if (getWalletBalance) {
        setCheckBalance(getWalletBalance);
      }
    }
  };

  return (
    <>
      {/* <Row> */}
      {/* 
        Check Balance 
      */}
      <Accordion defaultActiveKey='1' className='check-balance-accordian'>
        <Accordion.Item eventKey='0'>
          <Accordion.Header>
            Check Wallet Balance
            <Tooltip title='In this section you can check Wallet balance' arrow>
              <InfoOutlinedIcon className='infoIcon' />
            </Tooltip>
          </Accordion.Header>
          <Accordion.Body>
            <Form className='row justify-content-sm-center'>
              <Form.Group
                className='mb-3 col-md-6'
                controlId='checkUserAddress'>
                <Form.Label>Wallet Address</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Wallet Address'
                  required
                />
                <div className='invalid-feedback' id='checkAddressError'></div>
              </Form.Group>
              <Form.Group
                className='mb-3 col-md-6'
                controlId='checkUserAddress'></Form.Group>
            </Form>

            <button onClick={checkBalance} className='balance-button'>
              Check Balance
            </button>

            <hr />
            <p>
              Total Tokens: <span>{checkbalance}</span>
            </p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {/* </Row> */}
    </>
  );
};
