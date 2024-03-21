/** @format */

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import Accordion from "react-bootstrap/Accordion";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Form from "react-bootstrap/Form";

import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import swal from "sweetalert";
import { ContractMethods } from "../../smart_contract/Web3/contractMethods";

import Web3 from "web3";

export const TransferTokenAccordian = forwardRef((props, ref) => {
  const contract = ContractMethods();

  const [walletAddress, setWalletAddress] = useState(null);
  const [startAt, setStartAt] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [remainingTokens, setRemainingTokens] = useState(0);

  const [tokenQuantityVal, setTokenQuantityVal] = useState("");
  const [tokenPercentageVal, setTokenPercentageVal] = useState("");
  const [calculateTokenQuantity, setCalculateTokenQuantity] = useState("");
  const [totalcalculateTokenQuantity, setTotalCalculateTokenQuantity] =
    useState("");

  useEffect(() => {
    setAllValues();
  }, [props]);

  async function setAllValues() {
    let startAt = await contract.startAt();
    setStartAt(startAt);

    let maxSupply = await contract.maxSupply();
    setMaxSupply(maxSupply);

    let remainingTokens = await contract.totalRemainingTokens();
    setRemainingTokens(remainingTokens);

    /*
        get connected wallet address 
      */
    let address = localStorage.getItem("connectedAddress");
    if (address) {
      setWalletAddress(address);
    } else {
      setWalletAddress(null);
    }
  }

  useImperativeHandle(ref, () => ({
    setAllValues,
  }));

  // addressHandleChange;
  const addressHandleChange = () => {
    // call percentageHandleChange and pass current percentage value as percentageoftoken id value
    percentageHandleChange({ target: { value: tokenPercentageVal } });
  };

  const quantityHandleChange = (e) => {
    const regex = /^-?\d*\.?\d+$/;

    if (
      e.target.value !== "" &&
      regex.test(e.target.value) &&
      e.target.value > 0
    ) {
      setTokenQuantityVal(e.target.value);
    } else if (e.target.value === "") {
      setTokenQuantityVal("");
    }
  };

  const percentageHandleChange = (e) => {
    const regex = /^(?:100(?:\.0+)?|\d{0,2}(?:\.\d+)?|0(?:\.\d+)?)$/;

    if (
      (e.target.value !== "" && regex.test(e.target.value)) ||
      (e.target.value >= 0 && e.target.value <= 100)
    ) {
      setTokenPercentageVal(e.target.value);

      let percentage = (maxSupply * e.target.value) / 100;

      setCalculateTokenQuantity(percentage);

      var addresses = document.getElementById("userAddress").value;
      addresses = addresses.split(",");

      percentage = Math.round(percentage, percentage * addresses.length);

      setTotalCalculateTokenQuantity(percentage * addresses.length);
    } else if (e.target.value === "") {
      setTokenPercentageVal("");
      setCalculateTokenQuantity("");
    }
  };
  /* end take only number and percentage validation */

  /* show hide token quantity */
  const tokenQuantity = () => {
    document.getElementById("tokenQuantity").classList.remove("d-none");
    document.getElementById("tokenPercentage").classList.add("d-none");

    // empty percentage section
    document.getElementById("pertokenError").innerHTML = "";
    document.getElementById("percentageoftoken").classList.remove("is-invalid");

    setTokenPercentageVal("");
    setCalculateTokenQuantity("");
    setTotalCalculateTokenQuantity("");
  };
  /* end show hide token quantity*/

  /* show hide token percentage */
  const tokenPercentage = () => {
    document.getElementById("tokenQuantity").classList.add("d-none");
    document.getElementById("tokenPercentage").classList.remove("d-none");

    // empty token section
    document.getElementById("tokenError").innerHTML = "";
    document.getElementById("token").classList.remove("is-invalid");
    setTokenQuantityVal("");
  };
  /* end show hide token percentage*/

  /* Normal Validations */
  const validations = async () => {
    // check current address is contract owner or not

    if (walletAddress == null) {
      swal("Error!", "Wallet not Connected", "error");
      return false;
    }

    let whiteListed = await contract.whiteListed(walletAddress);

    // check current address is contract owner or not
    if (!whiteListed) {
      swal("Error!", "Only Owners can perform this action", "error");
      return false;
    }

    // check distribution already start or not
    if (startAt <= 0) {
      swal("Error!", "Distribution not Start!", "error");
      return false;
    }

    return true;
  };

  /* Start Distribution Token Validation */
  const formValidations = async (userAddress, percentRadio) => {
    let k = 0;
    let l = 0;

    let tokenValu = tokenQuantityVal * userAddress.length;
    let percentageVal = calculateTokenQuantity * userAddress.length;

    for (let i = 0; i < userAddress.length; i++) {
      /*
        Address Validation
      */

      if (!userAddress[i]) {
        document.getElementById("addressError").innerHTML =
          parseInt(i) + parseInt(1) + " Place: User Address is required";
        document.getElementById("userAddress").classList.add("is-invalid");

        k = 1;
        break;
      } else if (!Web3.utils.isAddress(userAddress[i])) {
        document.getElementById("addressError").innerHTML =
          parseInt(i) + parseInt(1) + " Place: User Address is not valid";
        document.getElementById("userAddress").classList.add("is-invalid");

        k = 1;
        break;
      } else {
        document.getElementById("addressError").innerHTML = "";
        document.getElementById("userAddress").classList.remove("is-invalid");

        k = 0;
      }
    }

    /*
      Token Validation
    */
    if (percentRadio) {
      if (!percentageVal) {
        document.getElementById("pertokenError").innerHTML =
          "Token Percentage is required";
        document
          .getElementById("percentageoftoken")
          .classList.add("is-invalid");

        l = 1;
      } else if (tokenPercentageVal > 100) {
        document.getElementById("pertokenError").innerHTML =
          "Not provide more than 100 percentage of token";
        document
          .getElementById("percentageoftoken")
          .classList.add("is-invalid");

        l = 1;
      }

      // else if ((percentageVal) > (remainingTokens)) {
      //   document.getElementById("pertokenError").innerHTML =
      //     "Only Transfer Token Under Unlocked Token " +
      //     remainingTokens.toLocaleString("fullwide", {
      //       useGrouping: false,
      //     });
      //   document
      //     .getElementById("percentageoftoken")
      //     .classList.add("is-invalid");

      //   l = 1;
      // }
      else {
        document.getElementById("pertokenError").innerHTML = "";
        document
          .getElementById("percentageoftoken")
          .classList.remove("is-invalid");
        l = 0;
      }
    } else {
      if (!tokenValu) {
        document.getElementById("tokenError").innerHTML = "Token is required";
        document.getElementById("token").classList.add("is-invalid");

        l = 1;
      }

      // else if ((remainingTokens) < (tokenValu)) {
      //   document.getElementById("tokenError").innerHTML =
      //     "Only Transfer Token Under Unlocked Token " +
      //     remainingTokens.toLocaleString("fullwide", {
      //       useGrouping: false,
      //     });
      //   document.getElementById("token").classList.add("is-invalid");

      //   l = 1;
      // }
      else {
        document.getElementById("tokenError").innerHTML = "";
        document.getElementById("token").classList.remove("is-invalid");
        l = 0;
      }
    }

    if (k > 0 || l > 0) {
      return false;
    }

    return true;
  };

  /*
    Create Logic for transfer token
  */
  const transferToken = async () => {
    if (!(await validations())) {
      return false;
    }

    let userAddress = document.getElementById("userAddress").value;
    userAddress = userAddress.trim();

    let percentRadio = document.getElementById("pecentage").checked;

    var multipleAddress = userAddress.split(",");

    // check for all validations
    if (!(await formValidations(multipleAddress, percentRadio))) {
      return false;
    }

    let token;
    if (percentRadio) {
      token = calculateTokenQuantity;
    } else {
      token = tokenQuantityVal;
    }

    token = token.toLocaleString("fullwide", {
      useGrouping: false,
    });

    swal({
      title: "Are you sure to Transfer Token?",
      icon: "warning",
      buttons: true,
      successMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        document.getElementById("loaderVisibility").classList.add("is-active");

        let result;
        token = token * 1e18;
        if (multipleAddress.length > 1) {
          result = await contract.mulipleTransferTokens(multipleAddress, token);
        } else {
          result = await contract.transferTokens(userAddress, token);
        }

        if (result) {
          document
            .getElementById("loaderVisibility")
            .classList.remove("is-active");
          swal("Success!", "Token Transfer Successfully!", "success");
          props.callBack();
        } else {
          document
            .getElementById("loaderVisibility")
            .classList.remove("is-active");
          swal(
            "Error!",
            "Something went wrong, Transaction not Success!",
            "error",
          );
        }
      }
    });
  };

  return (
    <>
      {/* <Row> */}
      <Accordion defaultActiveKey='1' className='transfer-token-accordian'>
        <Accordion.Item eventKey='0'>
          <Accordion.Header>
            Transfer Token
            <Tooltip
              title='In Token Transfer section You can transfer specific amount of tokens to user. after distribution started'
              arrow>
              <div>
                <InfoOutlinedIcon className='infoIcon' />
              </div>
            </Tooltip>
            {/* <span className="tooltiptext">hhhhhh</span> */}
          </Accordion.Header>

          <Accordion.Body>
            <Form className=' row justify-content-sm-center'>
              <Form.Group className='mb-3 col-md-6' controlId='userAddress'>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter User Address'
                  onChange={addressHandleChange}
                />
                <div className='invalid-feedback' id='addressError'></div>
              </Form.Group>

              <Form.Group className='mb-3 col-md-6'>
                {/* Radio Section Start */}
                <input
                  type='radio'
                  name='distributionDetail'
                  value='on'
                  className='me-1'
                  defaultChecked={true}
                  onClick={tokenQuantity}
                  id='quantity'></input>
                <Form.Label>Token (Quantity)</Form.Label>

                <input
                  type='radio'
                  name='distributionDetail'
                  value='off'
                  className='me-1 offset-md-1'
                  onClick={tokenPercentage}
                  id='pecentage'></input>
                <Form.Label>Token (Percentage %)</Form.Label>

                {/* Radio Section End */}

                {/* Quantity of token */}
                <div id='tokenQuantity'>
                  <Form.Control
                    type='text'
                    placeholder='Enter Token Quantity'
                    autoComplete='off'
                    id='token'
                    value={tokenQuantityVal}
                    onChange={quantityHandleChange}
                  />
                  <div className='invalid-feedback' id='tokenError'></div>
                </div>

                {/* Percentage of token */}
                <div id='tokenPercentage' className='d-none'>
                  <Form.Control
                    type='text'
                    placeholder='Enter Token Percentage'
                    autoComplete='off'
                    id='percentageoftoken'
                    value={tokenPercentageVal}
                    onChange={percentageHandleChange}
                  />
                  <div className='invalid-feedback' id='pertokenError'></div>

                  <div>
                    Token Quantity:{" "}
                    <span className='text-success'>
                      {calculateTokenQuantity ? calculateTokenQuantity : 0}
                    </span>
                    , Total Token:
                    <span className='text-success'>
                      {totalcalculateTokenQuantity
                        ? totalcalculateTokenQuantity
                        : 0}
                    </span>
                  </div>
                </div>
              </Form.Group>
            </Form>
            <Button
              onClick={transferToken}
              className='justify-content-sm-center transfer-button'>
              Transfer Token
            </Button>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {/* </Row> */}
    </>
  );
});
