/** @format */

import React, { useEffect, useRef, useState } from "react";

import { CardIndex } from "../componenets/pages/card/cardIndex";
import { CheckBalanceAccordian } from "../componenets/pages/checkBalanceAccordian/checkBalanceAccordian";
import { TransactionHistoryAccordian } from "../componenets/pages/transactionHistoryAccordian/transactionHistoryAccordian";
import { TransferTokenAccordian } from "../componenets/pages/transferTokenAccordian/transferTokenAccordian";

export const ContentIndex = (props) => {
  const [categoryDetail, setCategoryDetail] = useState();

  useEffect(() => {
    if (props.detail != undefined) {
      setCategoryDetail(props.detail);
    }
  }, [props]);

  const cardRef = useRef(null);
  const transferTokenRef = useRef(null);
  const txhistroyRef = useRef(null);

  const refreshData = () => {
    cardRef.current.setAllValues();
    transferTokenRef.current.setAllValues();
    txhistroyRef.current.setAllValues();
  };

  return (
    <>
      <div className='dashboard-content contract-detail'>
        <CardIndex
          categoryDetail={categoryDetail}
          callBack={() => refreshData()}
          ref={cardRef}
        />
      </div>
      <div className='dashboard-content accordian'>
        <TransferTokenAccordian
          categoryDetail={categoryDetail}
          callBack={() => refreshData()}
          ref={transferTokenRef}
        />

        <TransactionHistoryAccordian
          callBack={() => refreshData()}
          ref={txhistroyRef}
        />

        <CheckBalanceAccordian />
      </div>
    </>
  );
};
