/** @format */

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import Accordion from "react-bootstrap/Accordion";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import Tooltip from "@mui/material/Tooltip";

import "@fortawesome/fontawesome-free/css/all.min.css";

import { MDBDataTable } from "mdbreact";
import "mdbreact/dist/css/mdb.css";

import { ContractMethods } from "../../smart_contract/Web3/contractMethods";

export const TransactionHistoryAccordian = forwardRef((props, ref) => {
  const contract = ContractMethods();

  const [allusers, setAllUsers] = useState({ columns: "" }, { rows: "" });

  useEffect(() => {
    setAllValues();
  }, []);

  async function setAllValues() {
    /* 
      get all users values
    */
    var allUsers = await contract.allUsers();
    var history = await contract.getTransactionHistory(allUsers);
    if (history) {
      setAllUsers(history);
    }
  }

  useImperativeHandle(ref, () => ({
    setAllValues,
  }));

  return (
    <>
      {/* <Row> */}
      <Accordion defaultActiveKey='1' className='transaction-history-accordian'>
        <Accordion.Item eventKey='0'>
          <Accordion.Header>
            Transaction History
            <Tooltip
              title='This section gives you information about numbers of tokens send to different user address'
              arrow>
              <InfoOutlinedIcon className='infoIcon' />
            </Tooltip>
          </Accordion.Header>
          <Accordion.Body>
            {
              <MDBDataTable
                striped
                bordered
                data={allusers}
                entriesOptions={[5, 10, 25, 50, 100]}
              />
            }
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {/* </Row> */}
    </>
  );
});
