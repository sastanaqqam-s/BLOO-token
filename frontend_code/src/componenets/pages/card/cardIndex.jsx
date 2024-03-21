/** @format */

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

// import bootstrap2-toggle.css

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import swal from "sweetalert";

import AlarmOnIcon from "@mui/icons-material/AlarmOn";
import FunctionsIcon from "@mui/icons-material/Functions";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PunchClockIcon from "@mui/icons-material/PunchClock";

import { ContractMethods } from "../../smart_contract/Web3/contractMethods";

export const CardIndex = forwardRef((props, ref) => {
  const [detail, setDetail] = useState(null);

  var contractDetail;

  var contract = ContractMethods();

  const [walletAddress, setWalletAddress] = useState(null);

  const [startAt, setStartAt] = useState(0);
  const [cliffTime, setCliffTime] = useState("");
  const [totalUnlockedTokens, setTotalUnlockedTokens] = useState(0);
  const [remainingTokens, setRemainingTokens] = useState(0);

  const [toggleActive, setToggleActive] = useState(false);

  useEffect(() => {
    if (props.categoryDetail != undefined) {
      setAllValues();
      const intervalId = setInterval(countDownCalling, 1000);
      return () => clearInterval(intervalId);
    }
  }, [props]);

  useEffect(() => {
    if (toggleActive) {
      countDownCalling();
    }
  }, [toggleActive]);

  const countDownCalling = async () => {
    var nextUnlock = await nextDistributionTime(startAt, contractDetail);

    setCliffTime(nextUnlock[0]);
  };

  const setAllValues = async () => {
    contractDetail = props.categoryDetail;

    setDetail(props.categoryDetail);

    let start = await contract.startAt();
    start > 0 ? setToggleActive(true) : setToggleActive(false);
    setStartAt(start);

    let totalUnlockedTokens = await contract.totalUnlockedTokens();
    setTotalUnlockedTokens(totalUnlockedTokens);

    let remainingTokens = await contract.totalRemainingTokens();
    setRemainingTokens(remainingTokens);

    let address = localStorage.getItem("connectedAddress");
    if (address) {
      setWalletAddress(address);
    } else {
      setWalletAddress(null);
    }
  };

  useImperativeHandle(ref, () => ({
    setAllValues,
  }));

  const toggle = async () => {
    if (startAt > 0) {
      swal("Error!", "Distribution Already Started!", "error");
    } else {
      await startDistribution();
    }
  };

  const startDistribution = async () => {
    if (!(await startValidations())) {
      return false;
    }

    swal({
      title: "Are you sure to Start Token Distribution?",
      icon: "warning",
      successMode: true,
      buttons: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        document.getElementById("loaderVisibility").classList.add("is-active");

        let result = await contract.startDistribution();

        if (result) {
          document
            .getElementById("loaderVisibility")
            .classList.remove("is-active");

          setAllValues();
          setToggleActive(!toggleActive);

          swal("Success!", "Distribution Start SuccessFully!", "success");

          props.callBack();

          window.location.reload();
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

  const startValidations = async () => {
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

    //contract have balance or not

    // check distribution already start or not
    if (startAt > 0) {
      swal("Error!", "Distribution Already Start!", "error");
      return false;
    }

    return true;
  };

  const nextDistributionTime = async (startAt, categoryDetail) => {
    let intervalPeriod = 3600;
    const cliff = parseInt(categoryDetail?.lockedPeriod);
    const vested = parseInt(categoryDetail?.vestingPeriod);
    const startTime = parseInt(startAt);

    const currentTime = Math.round(Date.now() / 1000);
    const cliffTime = startTime + cliff * intervalPeriod;
    const cliffVestedTime = startTime + (cliff + vested) * intervalPeriod;

    var distance;

    // distribution start
    if (startTime > 0) {
      // check cliff Timing
      if (cliffTime > currentTime) {
        distance = cliffTime - currentTime;
        let cliffTimeValue = calculateNextTime(distance);
        return ["Cliff Month: " + cliffTimeValue, distance];
      }

      // check cliff and Vested Timing
      else if (cliffVestedTime > currentTime) {
        distance = cliffVestedTime - currentTime;
        let cliffTimeValue = calculateNextTime(distance);
        return ["Vested Month: " + cliffTimeValue, distance];
      }

      // All time completed
      else {
        return ["Cliff and Vested Time Completed", 0];
      }
    } else {
      return ["Distribution Not Start", 0];
    }
  };

  /* Start to  Calculate Running Time*/
  function calculateNextTime(distance) {
    const second = 1;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    var days = Math.floor(distance / day);
    var hourss = Math.floor((distance % day) / hour);
    var minutes = Math.floor((distance % hour) / minute);
    var seconds = Math.floor((distance % minute) / second);

    let updatedTime =
      days +
      " Days: " +
      hourss +
      " Hrs: " +
      minutes +
      " Min: " +
      seconds +
      " Sec";

    return updatedTime;
  }

  return (
    <>
      <Col>
        <Row>
          <Col sm={12}>
            <Row>
              <Col sm={4}>
                <div className='startDistribution d-flex'>
                  Distribution Status
                  <Tooltip
                    title='In Token Distribution status section you can check like Distribution Started or not'
                    arrow>
                    <InfoOutlinedIcon className='infoIcon' />
                  </Tooltip>
                  : &nbsp;
                  <div
                    className={`custom-toggle ${toggleActive ? "active" : ""}`}
                    onClick={toggle}>
                    <div className='toggle-button'></div>
                  </div>
                </div>
              </Col>

              <Col sm={8} className='text-end'>
                <Row>
                  <p>
                    Token Next Unlock Time:{" "}
                    <span style={{ fontWeight: 600 }}>{cliffTime}</span>
                  </p>
                </Row>
              </Col>

              {/* <Col sm={2}>
                <Row className='mb-3'>
                  <Col sm={12} type='button'>
                    <span onClick={refreshDetails}>
                      <RefreshIcon className='refreshIcon' />
                      <small className='text-decoration-underline'>
                        Refresh Details
                      </small>
                    </span>
                  </Col>
                </Row>
              </Col> */}
            </Row>

            <Row className='mx-auto justify-content-between'>
              <Card className='large-card-box-spacing cardColor0'>
                <Card.Body>
                  <div className='cardCircle'>
                    <FunctionsIcon />
                  </div>
                  <small>Total Unloked Token:</small>
                  <h5>
                    <b>{totalUnlockedTokens > 0 ? totalUnlockedTokens : 0}</b>
                  </h5>
                </Card.Body>
              </Card>

              <Card className='big-card-box-spacing cardColor3'>
                <Card.Body>
                  <div className='cardCircle'>
                    <LockOpenIcon />
                  </div>
                  <small>Remaining Tokens:</small>
                  <h5>
                    <b>{remainingTokens > 0 ? remainingTokens : 0}</b>
                  </h5>
                </Card.Body>
              </Card>

              <Card className='big-card-box-spacing cardColor1'>
                <Card.Body>
                  <div className='cardCircle'>
                    <FunctionsIcon />
                  </div>

                  <small>Total Token:</small>
                  <h5>
                    <b>{detail?.totalTokens > 0 ? detail?.totalTokens : 0}</b>
                  </h5>
                </Card.Body>
              </Card>

              <Card className='big-card-box-spacing cardColor2'>
                <Card.Body>
                  <div className='cardCircle'>
                    <HourglassBottomIcon />
                  </div>
                  <small>Average Release:</small>
                  <h5>
                    <b>
                      {detail?.avgReleasedToken > 0
                        ? detail?.avgReleasedToken
                        : 0}
                    </b>
                  </h5>
                </Card.Body>
              </Card>

              <Card className='small-card-box-spacing cardColor4'>
                <Card.Body>
                  <div className='cardCircle'>
                    <PunchClockIcon />
                  </div>
                  <small>Cliff Month:</small>
                  <h5>
                    <b>{detail?.lockedPeriod > 0 ? detail?.lockedPeriod : 0}</b>
                  </h5>
                </Card.Body>
              </Card>

              <Card className='small-card-box-spacing cardColor5'>
                <Card.Body>
                  <div className='cardCircle'>
                    <AlarmOnIcon />
                  </div>
                  <small>Vested Month:</small>
                  <h5>
                    <b>
                      {detail?.vestingPeriod > 0 ? detail?.vestingPeriod : 0}
                    </b>
                  </h5>
                </Card.Body>
              </Card>
            </Row>
          </Col>
        </Row>
      </Col>
    </>
  );
});
